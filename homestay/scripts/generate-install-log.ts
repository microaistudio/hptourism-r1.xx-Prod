/**
 * Installation Log Generator
 * 
 * Generates a detailed log file after deployment to verify what was installed.
 * Run: npx tsx scripts/generate-install-log.ts
 * Output: install_manifest.json + install_log.txt
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

interface InstallManifest {
    version: string;
    generatedAt: string;
    environment: {
        nodeEnv: string;
        port: string;
        appUrl: string;
        databaseConnected: boolean;
    };
    files: {
        critical: { name: string; exists: boolean; size?: number }[];
        serverDist: boolean;
        clientDist: boolean;
    };
    system: {
        nodeVersion: string;
        hostname: string;
        platform: string;
    };
}

async function checkDatabaseConnection(): Promise<boolean> {
    try {
        const { db } = await import("../server/db");
        const { sql } = await import("drizzle-orm");
        await db.execute(sql`SELECT 1`);
        return true;
    } catch {
        return false;
    }
}

function getFileInfo(filePath: string): { exists: boolean; size?: number } {
    try {
        const stats = fs.statSync(filePath);
        return { exists: true, size: stats.size };
    } catch {
        return { exists: false };
    }
}

function getPackageVersion(): string {
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
        return pkg.version || "unknown";
    } catch {
        return "unknown";
    }
}

async function generateManifest(): Promise<InstallManifest> {
    const version = getPackageVersion();
    const dbConnected = await checkDatabaseConnection();

    // Critical files to check
    const criticalFiles = [
        "package.json",
        ".env",
        "dist/index.js",
        "dist/public/index.html",
        "ecosystem.config.cjs",
        "scripts/verify-env.ts",
    ];

    const fileChecks = criticalFiles.map((f) => {
        const info = getFileInfo(path.join(projectRoot, f));
        return { name: f, ...info };
    });

    const manifest: InstallManifest = {
        version,
        generatedAt: new Date().toISOString(),
        environment: {
            nodeEnv: process.env.NODE_ENV || "undefined",
            port: process.env.PORT || "undefined",
            appUrl: process.env.APP_URL || "undefined",
            databaseConnected: dbConnected,
        },
        files: {
            critical: fileChecks,
            serverDist: fs.existsSync(path.join(projectRoot, "dist/index.js")),
            clientDist: fs.existsSync(path.join(projectRoot, "dist/public")),
        },
        system: {
            nodeVersion: process.version,
            hostname: (await import("os")).hostname(),
            platform: process.platform,
        },
    };

    return manifest;
}

function generateTextLog(manifest: InstallManifest): string {
    const lines: string[] = [
        "╔══════════════════════════════════════════════════════════════╗",
        "║        HP TOURISM HOMESTAY PORTAL - INSTALLATION LOG         ║",
        "╚══════════════════════════════════════════════════════════════╝",
        "",
        `📦 Version:     ${manifest.version}`,
        `📅 Generated:   ${manifest.generatedAt}`,
        `🖥️  Hostname:    ${manifest.system.hostname}`,
        `⚙️  Node:        ${manifest.system.nodeVersion}`,
        `🌐 Platform:    ${manifest.system.platform}`,
        "",
        "─── ENVIRONMENT ───────────────────────────────────────────────",
        `  NODE_ENV:     ${manifest.environment.nodeEnv}`,
        `  PORT:         ${manifest.environment.port}`,
        `  APP_URL:      ${manifest.environment.appUrl}`,
        `  DB Connected: ${manifest.environment.databaseConnected ? "✅ Yes" : "❌ No"}`,
        "",
        "─── CRITICAL FILES ────────────────────────────────────────────",
    ];

    for (const file of manifest.files.critical) {
        const status = file.exists ? "✅" : "❌";
        const size = file.size ? ` (${(file.size / 1024).toFixed(1)} KB)` : "";
        lines.push(`  ${status} ${file.name}${size}`);
    }

    lines.push("");
    lines.push("─── BUILD STATUS ──────────────────────────────────────────────");
    lines.push(`  Server Dist:  ${manifest.files.serverDist ? "✅ Present" : "❌ Missing"}`);
    lines.push(`  Client Dist:  ${manifest.files.clientDist ? "✅ Present" : "❌ Missing"}`);
    lines.push("");
    lines.push("═══════════════════════════════════════════════════════════════");
    lines.push("  Installation log generated successfully.");
    lines.push("  Share this file with support for verification.");
    lines.push("═══════════════════════════════════════════════════════════════");

    return lines.join("\n");
}

async function main() {
    console.log("🔍 Generating installation log...\n");

    const manifest = await generateManifest();

    // Save JSON manifest
    const jsonPath = path.join(projectRoot, "install_manifest.json");
    fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Saved: ${jsonPath}`);

    // Save text log
    const textLog = generateTextLog(manifest);
    const txtPath = path.join(projectRoot, "install_log.txt");
    fs.writeFileSync(txtPath, textLog);
    console.log(`✅ Saved: ${txtPath}`);

    // Print to console
    console.log("\n" + textLog);

    // Exit with appropriate code
    const allCriticalPresent = manifest.files.critical.every((f) => f.exists);
    if (!allCriticalPresent || !manifest.environment.databaseConnected) {
        console.log("\n⚠️  Some checks failed. Review the log above.");
        process.exit(1);
    }

    console.log("\n✅ All checks passed.");
    process.exit(0);
}

main().catch((e) => {
    console.error("Failed to generate installation log:", e);
    process.exit(1);
});
