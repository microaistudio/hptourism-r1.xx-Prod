/**
 * Backup Service
 * 
 * Provides database and file backup functionality with Hybrid Strategy:
 * - PostgreSQL: Daily Snapshots (pg_dump)
 * - Files: Incremental Mirroring (rsync) - Scalable for 10TB+
 * - Config: Secure copy of .env
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { config } from "@shared/config";
import { logger } from "../logger";
import { db } from "../db";
import { systemSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

const execAsync = promisify(exec);
const backupLog = logger.child({ module: "backup-service" });

// Backup settings key in system_settings
export const BACKUP_SETTINGS_KEY = "backup_configuration";

// Default backup configuration
export interface BackupSettings {
    enabled: boolean;
    schedule: string; // Cron expression
    backupDirectory: string;
    retentionDays: number;
    includeDatabase: boolean;
    includeFiles: boolean;
    includeEnv: boolean; // New: Include .env file
    lastBackupAt?: string;
    lastBackupStatus?: "success" | "failed";
    lastBackupStatus?: "success" | "failed";
    lastBackupError?: string;
    // Failover Settings
    enableFailover: boolean;
    fallbackDirectory: string;
}

export const DEFAULT_BACKUP_SETTINGS: BackupSettings = {
    enabled: true,
    schedule: "0 2 * * *", // Daily at 2 AM
    backupDirectory: path.resolve(process.cwd(), "backups"),
    retentionDays: 30,
    includeDatabase: true,
    includeFiles: true,
    includeEnv: true,
    // Failover Defaults
    enableFailover: false,
    fallbackDirectory: path.resolve(process.cwd(), "backups_fallback"),
};

// Backup metadata stored with each backup
export interface BackupMetadata {
    id: string;
    createdAt: string;
    type: "hybrid";
    databaseFile?: string;
    filesSynced?: boolean;
    filesCount?: number; // Approximate
    envBackedUp?: boolean;
    status: "success" | "failed";
    error?: string;
    duration?: number;
    sizeBytes?: number; // Total size of database backup
}

/**
 * Get current backup settings from database
 */
export async function getBackupSettings(): Promise<BackupSettings> {
    try {
        const [record] = await db
            .select()
            .from(systemSettings)
            .where(eq(systemSettings.settingKey, BACKUP_SETTINGS_KEY))
            .limit(1);

        if (!record || !record.settingValue) {
            return DEFAULT_BACKUP_SETTINGS;
        }

        return {
            ...DEFAULT_BACKUP_SETTINGS,
            ...(record.settingValue as Partial<BackupSettings>),
        };
    } catch (error) {
        backupLog.error("Failed to get backup settings, using defaults", error);
        return DEFAULT_BACKUP_SETTINGS;
    }
}

/**
 * Save backup settings to database
 */
export async function saveBackupSettings(settings: Partial<BackupSettings>): Promise<BackupSettings> {
    const current = await getBackupSettings();
    const updated = { ...current, ...settings };

    const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, BACKUP_SETTINGS_KEY))
        .limit(1);

    if (existing) {
        await db
            .update(systemSettings)
            .set({ settingValue: updated, updatedAt: new Date() })
            .where(eq(systemSettings.settingKey, BACKUP_SETTINGS_KEY));
    } else {
        await db.insert(systemSettings).values({
            settingKey: BACKUP_SETTINGS_KEY,
            settingValue: updated,
        });
    }

    return updated;
}

/**
 * Ensure backup directory exists
 */
async function ensureBackupDirectory(backupDir: string): Promise<void> {
    await fsPromises.mkdir(backupDir, { recursive: true });
    // create subdirectories
    await fsPromises.mkdir(path.join(backupDir, "db"), { recursive: true });
    await fsPromises.mkdir(path.join(backupDir, "files"), { recursive: true });
    await fsPromises.mkdir(path.join(backupDir, "config"), { recursive: true });
}

/**
 * Generate backup ID based on timestamp
 */
function generateBackupId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    return `backup_${year}${month}${day}_${hour}${minute}${second}`;
}

/**
 * Backup PostgreSQL database using pg_dump (Snapshot Strategy)
 */
export async function backupDatabase(backupDir: string, backupId: string): Promise<string> {
    const databaseUrl = config.database.url;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL not configured");
    }

    const dbDir = path.join(backupDir, "db");
    const outputFile = path.join(dbDir, `${backupId}_database.sql`);
    const compressedFile = `${outputFile}.gz`;

    backupLog.info({ backupId, outputFile }, "Starting database backup");

    try {
        // Use pg_dump with gzip compression
        const command = `pg_dump "${databaseUrl}" | gzip > "${compressedFile}"`;
        await execAsync(command, { timeout: 15 * 60 * 1000 }); // 15 minute timeout

        const stats = await fsPromises.stat(compressedFile);
        backupLog.info(
            { backupId, file: compressedFile, sizeBytes: stats.size },
            "Database backup completed"
        );

        return compressedFile;
    } catch (error) {
        backupLog.error({ backupId, error }, "Database backup failed");
        throw error;
    }
}

/**
 * Backup file storage directory using RSYNC (Mirror Strategy)
 * This is crucial for 10TB+ scale where Zip is impossible.
 */
export async function backupFilesRsync(backupDir: string): Promise<boolean> {
    const sourceDir = config.objectStorage.localDirectory;
    const destDir = path.join(backupDir, "files");

    if (!sourceDir || !fs.existsSync(sourceDir)) {
        backupLog.warn({ sourceDir }, "File storage directory not found, skipping file backup");
        return false;
    }

    backupLog.info({ sourceDir, destDir }, "Starting incremental file sync (rsync)");

    try {
        // Rsync flags explaination:
        // -a: archive mode (preserves permissions, times, symbolic links)
        // -v: verbose
        // --delete: delete files in destination that are gone from source (True Mirror)
        const command = `rsync -av --delete "${sourceDir}/" "${destDir}/"`;

        // Timeout set to 4 hours for potentially large initial syncs, though subsequent syncs will be fast
        await execAsync(command, { timeout: 4 * 60 * 60 * 1000 });

        backupLog.info("File sync completed successfully");
        return true;
    } catch (error) {
        backupLog.error({ error }, "File sync failed");
        throw error;
    }
}

/**
 * Backup Configuration (.env)
 * SECURITY WARNING: This stores secrets in the backup folder.
 */
export async function backupConfig(backupDir: string, backupId: string): Promise<boolean> {
    const sourceEnv = path.resolve(process.cwd(), ".env");
    const configDir = path.join(backupDir, "config");
    const destEnv = path.join(configDir, `${backupId}.env`);

    if (!fs.existsSync(sourceEnv)) {
        backupLog.warn("No .env file found to backup");
        return false;
    }

    try {
        await fsPromises.copyFile(sourceEnv, destEnv);

        // Also update a 'latest' symlink or copy for easy restore finding
        const latestEnv = path.join(configDir, "latest.env");
        await fsPromises.copyFile(sourceEnv, latestEnv);

        backupLog.info({ destEnv }, "Configuration backup completed");
        return true;
    } catch (error) {
        backupLog.error({ error }, "Configuration backup failed");
        throw error;
    }
}

/**
 * Run a full backup (database + files + config)
 */
export async function runFullBackup(): Promise<BackupMetadata> {
    const startTime = Date.now();
    const settings = await getBackupSettings();
    const backupId = generateBackupId();
    let backupDir = settings.backupDirectory;
    let usingFallback = false;

    backupLog.info({ backupId, backupDir }, "Starting hybrid backup");

    // 0. Directory Check & Failover Logic
    try {
        await ensureBackupDirectory(backupDir);
    } catch (dirError) {
        if (settings.enableFailover && settings.fallbackDirectory) {
            backupLog.warn(
                { primary: backupDir, fallback: settings.fallbackDirectory, error: dirError },
                "Primary backup directory inaccessible. Attempting failover..."
            );
            try {
                // Switch to fallback
                backupDir = settings.fallbackDirectory;
                await ensureBackupDirectory(backupDir);
                usingFallback = true;
                backupLog.info("Access to fallback directory confirmed. Proceeding with backup.");
            } catch (fallbackError) {
                // Both failed
                const msg = `Backup failed: Primary and Fallback directories are inaccessible.`;
                backupLog.error({ primaryError: dirError, fallbackError }, msg);

                await saveBackupSettings({
                    lastBackupAt: new Date().toISOString(),
                    lastBackupStatus: "failed",
                    lastBackupError: msg,
                });
                throw new Error(msg);
            }
        } else {
            // No failover configured
            const msg = `Backup directory inaccessible: ${(dirError as Error).message}`;
            await saveBackupSettings({
                lastBackupAt: new Date().toISOString(),
                lastBackupStatus: "failed",
                lastBackupError: msg,
            });
            throw dirError;
        }
    }

    const metadata: BackupMetadata = {
        id: backupId,
        createdAt: new Date().toISOString(),
        type: "hybrid",
        status: "success",
    };

    // Add note about fallback if used
    if (usingFallback) {
        metadata.error = "NOTE: Primary backup location failed. Used fallback location.";
    }

    try {
        // 1. Database Snapshot
        if (settings.includeDatabase) {
            try {
                metadata.databaseFile = await backupDatabase(backupDir, backupId);
            } catch (dbError) {
                metadata.status = "failed";
                metadata.error = `Database backup failed: ${(dbError as Error).message}`;
            }
        }

        // 2. Config Snapshot
        if (settings.includeEnv) {
            try {
                metadata.envBackedUp = await backupConfig(backupDir, backupId);
            } catch (envError) {
                // Non-fatal, but logged
                backupLog.error({ error: envError }, "Config backup failed");
            }
        }

        // 3. Files Mirror (Rsync) - Runs last as it might take longest
        if (settings.includeFiles) {
            try {
                metadata.filesSynced = await backupFilesRsync(backupDir);
            } catch (fileError) {
                metadata.status = "failed";
                const msg = `File sync failed: ${(fileError as Error).message}`;
                metadata.error = metadata.error ? `${metadata.error}; ${msg}` : msg;
            }
        }

        metadata.duration = Date.now() - startTime;

        // Save execution log/metadata (Separate from the files)
        const metadataFile = path.join(backupDir, "db", `${backupId}_metadata.json`);
        await fsPromises.writeFile(metadataFile, JSON.stringify(metadata, null, 2));

        // Update last backup info in settings
        await saveBackupSettings({
            lastBackupAt: metadata.createdAt,
            lastBackupStatus: metadata.status,
            lastBackupError: metadata.error,
        });

        backupLog.info(
            { backupId, duration: metadata.duration, status: metadata.status },
            "Hybrid backup completed"
        );

        // Cleanup old DB snapshots (Files are self-cleaning via rsync --delete)
        await cleanupOldSnapshots(backupDir, settings.retentionDays);

        return metadata;
    } catch (error) {
        metadata.status = "failed";
        metadata.error = (error as Error).message;
        metadata.duration = Date.now() - startTime;

        await saveBackupSettings({
            lastBackupAt: metadata.createdAt,
            lastBackupStatus: "failed",
            lastBackupError: metadata.error,
        });

        throw error;
    }
}

/**
 * Clean up old Database/Config snapshots
 * (Does NOT touch files folder as that is a mirror)
 */
export async function cleanupOldSnapshots(backupDir: string, retentionDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    let deletedCount = 0;
    const dbDir = path.join(backupDir, "db");
    const configDir = path.join(backupDir, "config");

    try {
        // Clean DB Dumps
        if (fs.existsSync(dbDir)) {
            const files = await fsPromises.readdir(dbDir);
            for (const file of files) {
                // Expecting filenames like: backup_YYYYMMDD_HHMMSS_database.sql.gz
                // Simple check by file creation time is safer
                const filePath = path.join(dbDir, file);
                const stats = await fsPromises.stat(filePath);

                if (stats.mtime < cutoffDate) {
                    await fsPromises.unlink(filePath);
                    deletedCount++;
                }
            }
        }

        // Clean Config Dumps
        if (fs.existsSync(configDir)) {
            const files = await fsPromises.readdir(configDir);
            for (const file of files) {
                if (file === "latest.env") continue; // Keep the latest pointer

                const filePath = path.join(configDir, file);
                const stats = await fsPromises.stat(filePath);

                if (stats.mtime < cutoffDate) {
                    await fsPromises.unlink(filePath);
                    deletedCount++;
                }
            }
        }

        if (deletedCount > 0) {
            backupLog.info({ deletedCount, retentionDays }, "Cleanup of old snapshots completed");
        }
    } catch (error) {
        backupLog.error({ error }, "Backup cleanup failed");
    }

    return deletedCount;
}

/**
 * List available DB Backups
 */
/**
 * List available Backups (reading from metadata files)
 */
export async function listBackups(): Promise<BackupMetadata[]> {
    try {
        const settings = await getBackupSettings();
        const dbDir = path.join(settings.backupDirectory, "db");

        if (!fs.existsSync(dbDir)) return [];

        const files = await fsPromises.readdir(dbDir);
        const metadataFiles = files.filter(f => f.endsWith("_metadata.json"));

        const backups: BackupMetadata[] = [];

        for (const file of metadataFiles) {
            try {
                const content = await fsPromises.readFile(path.join(dbDir, file), "utf-8");
                const metadata = JSON.parse(content);
                // Ensure required fields exist or add defaults to prevent crashes
                if (!metadata.createdAt) metadata.createdAt = new Date().toISOString();

                // Calculate sizeBytes from the database file if not already set
                if (metadata.sizeBytes === undefined && metadata.id) {
                    try {
                        const dbFile = path.join(dbDir, `${metadata.id}_database.sql.gz`);
                        if (fs.existsSync(dbFile)) {
                            const stats = await fsPromises.stat(dbFile);
                            metadata.sizeBytes = stats.size;
                        } else {
                            metadata.sizeBytes = 0;
                        }
                    } catch {
                        metadata.sizeBytes = 0;
                    }
                }

                backups.push(metadata);
            } catch (err) {
                // Ignore corrupted metadata files
                backupLog.warn({ file, err }, "Failed to read backup metadata");
            }
        }

        // Sort by date desc
        return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        backupLog.error({ error }, "Failed to list backups");
        return [];
    }
}

/**
 * Delete a backup (artifacts and metadata)
 */
export async function deleteBackup(backupId: string): Promise<boolean> {
    try {
        const settings = await getBackupSettings();
        const dbDir = path.join(settings.backupDirectory, "db");
        const configDir = path.join(settings.backupDirectory, "config");
        // Files are incremental/mirror, we don't delete standard file backups by ID usually, 
        // unless we implementing point-in-time recovery which this simple rsync doesn't support fully.
        // We only delete the DB snapshot and Config snapshot.

        const filesToDelete = [
            path.join(dbDir, `${backupId}_database.sql.gz`),
            path.join(dbDir, `${backupId}_metadata.json`),
            path.join(configDir, `${backupId}.env`)
        ];

        let success = false;
        for (const file of filesToDelete) {
            if (fs.existsSync(file)) {
                await fsPromises.unlink(file);
                success = true;
            }
        }

        backupLog.info({ backupId, success }, "Backup deleted");
        return success;
    } catch (error) {
        backupLog.error({ backupId, error }, "Failed to delete backup");
        return false;
    }
}

/**
 * Get file path for download
 */
export async function getBackupFilePath(backupId: string, type: "database" | "files"): Promise<string | null> {
    try {
        const settings = await getBackupSettings();

        if (type === "database") {
            const dbDir = path.join(settings.backupDirectory, "db");
            const file = path.join(dbDir, `${backupId}_database.sql.gz`);
            return fs.existsSync(file) ? file : null;
        }

        // Files download is tricky for rsync folders. 
        // For now, we only support DB download as 'files' gives huge folder.
        // Or we could zip it on the fly but that's expensive.
        // Returning null for 'files' type currently.
        return null;
    } catch (error) {
        return null;
    }
}
