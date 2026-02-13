/**
 * Date utility functions for HP Tourism Portal
 * All dates are displayed in IST (Indian Standard Time) since this
 * portal is exclusively for Himachal Pradesh Government.
 *
 * Database stores timestamps in UTC (via Node.js new Date()).
 * These helpers ensure display is always in IST to match HimKosh
 * and other government systems.
 */

const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Format a date/timestamp to IST display string
 * Example: "11/02/2026, 14:52:46"
 */
export function formatDateTimeIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleString("en-IN", { timeZone: IST_TIMEZONE });
}

/**
 * Format a date to IST date-only string
 * Example: "11/02/2026"
 */
export function formatDateIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString("en-IN", { timeZone: IST_TIMEZONE });
}

/**
 * Format a date to IST with full month name
 * Example: "11 February 2026, 2:52 PM"
 */
export function formatDateTimeLongIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleString("en-IN", {
        timeZone: IST_TIMEZONE,
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Format date for payment/transaction display (DD/MM/YYYY, HH:MM:SS)
 * Matches HimKosh timestamp format
 */
export function formatPaymentDateIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleString("en-IN", {
        timeZone: IST_TIMEZONE,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

/**
 * Format a date to IST time-only string
 * Example: "2:52 PM"
 */
export function formatTimeIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleTimeString("en-IN", {
        timeZone: IST_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Format a date to IST with full month name (Date only)
 * Example: "11 February 2026"
 */
export function formatDateLongIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString("en-IN", {
        timeZone: IST_TIMEZONE,
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/**
 * Format a date to IST YYYY-MM-DD string for HTML input[type="date"]
 * This ensures the date picker shows the correct IST date instead of UTC previous day.
 */
export function formatDateInputIST(value?: string | Date | null): string {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    // en-CA locale formats as YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: IST_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(parsed);
}

/**
 * Format a DB timestamp that was stored as IST wall-clock time but treated as UTC by Node.
 * This avoids the "Double Shift" problem (IST -> UTC -> IST (+5:30) = +5:30 ahead).
 * We simply display the raw UTC time components, which match the original IST wall-clock time.
 */
export function formatDbTimestamp(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);

    // Display using UTC timezone to reveal the raw value stored in DB/API
    // (which effectively represents the IST time)
    return parsed.toLocaleString("en-IN", {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}
