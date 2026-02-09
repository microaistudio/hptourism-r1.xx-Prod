/**
 * Application Version Configuration
 * SINGLE SOURCE OF TRUTH - Keep in sync with package.json
 * Current: 1.0.7
 */

export const APP_VERSION = {
    major: 1,
    minor: 0,
    patch: 11,
    releaseCandidate: "R1",
    codename: "Officer Print",
    buildDate: "2026-02-09",

    // Full version string
    get full(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    },

    // Display version with RC
    get display(): string {
        return `v${this.full} (${this.releaseCandidate})`;
    },

    // Detailed version for admin
    get detailed(): string {
        return `v${this.full} ${this.releaseCandidate} - ${this.codename}`;
    }
};

// Version info levels for different user roles
export interface VersionInfo {
    version: string;
    releaseCandidate?: string;
    codename?: string;
    buildDate?: string;
    environment?: string;
    features?: string[];
}

/**
 * Get version info based on user role
 */
export function getVersionInfo(role: "owner" | "officer" | "admin" | "superadmin"): VersionInfo {
    const baseInfo: VersionInfo = {
        version: APP_VERSION.full,
    };

    if (role === "owner") {
        // Minimal info for property owners
        return baseInfo;
    }

    if (role === "officer") {
        // DA/DTDO see RC info
        return {
            ...baseInfo,
            releaseCandidate: APP_VERSION.releaseCandidate,
        };
    }

    if (role === "admin" || role === "superadmin") {
        // Full info for admins
        return {
            ...baseInfo,
            releaseCandidate: APP_VERSION.releaseCandidate,
            codename: APP_VERSION.codename,
            buildDate: APP_VERSION.buildDate,
            environment: process.env.NODE_ENV || "development",
            features: [
                "E2E Test Suite",
                "Upfront Payment Flow",
                "Document Sync",
                "PDF Upload Support",
            ],
        };
    }

    return baseInfo;
}
