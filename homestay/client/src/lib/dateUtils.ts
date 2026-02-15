/**
 * Date utility functions for HP Tourism Portal
 * All dates are displayed in IST (Indian Standard Time) since this
 * portal is exclusively for Himachal Pradesh Government.
 *
 * Pipeline:
 *  1. DB (Asia/Kolkata) stores IST wall-clock in "timestamp without time zone"
 *  2. Server's pg driver appends "+05:30" (manual override) when parsing (see server/db.ts)
 *  3. Express JSON serialisation converts Date → ISO-8601 UTC string ("…Z")
 *  4. Client receives UTC string and displays in IST via DISPLAY_TIMEZONE
 *
 * This relies on the server environment being correctly set to IST.
 */

// localized format to Indian Standard Time
const DISPLAY_TIMEZONE = "Asia/Kolkata";

/**
 * Format a date/timestamp to IST display string
 * Example: "11/02/2026, 14:52:46"
 */
export function formatDateTimeIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleString("en-IN", { timeZone: DISPLAY_TIMEZONE });
}

/**
 * Format a date to IST date-only string
 * Example: "11/02/2026"
 */
export function formatDateIST(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString("en-IN", { timeZone: DISPLAY_TIMEZONE });
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
        timeZone: DISPLAY_TIMEZONE,
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
        timeZone: DISPLAY_TIMEZONE,
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
        timeZone: DISPLAY_TIMEZONE,
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
        timeZone: DISPLAY_TIMEZONE,
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
        timeZone: DISPLAY_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(parsed);
}

/**
 * Format a DB timestamp. Since the server environment is now correctly configured to IST,
 * the pg driver handles timezone offsets correctly, and we can simply display as IST.
 */
export function formatDbTimestamp(value?: string | Date | null): string {
    if (!value) return "—";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);

    return parsed.toLocaleString("en-IN", {
        timeZone: DISPLAY_TIMEZONE,
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}
