// Application version — AUTO-READ from package.json at build time via Vite define()
// NEVER hardcode a version string here. The version in package.json is the single source of truth.
export const APP_VERSION: string = import.meta.env.APP_VERSION ?? "0.0.0";
export const SERVER_ID = ""; // Left empty for release builds
