# 🕐 Timezone Bug: Drizzle ORM + PostgreSQL IST Mismatch

**Document Version:** 1.0  
**Date:** 15 February 2026  
**Application:** HP Tourism Homestay Portal (`hptourism-dev1`)  
**Stack:** Node.js 20 · PostgreSQL 16 · Drizzle ORM · Express · React  
**Author:** Debugging Session, 14–15 Feb 2026  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Symptom](#2-the-symptom)
3. [Root Cause — Explained Simply](#3-root-cause--explained-simply)
4. [Root Cause — Deep Technical Analysis](#4-root-cause--deep-technical-analysis)
5. [The Full Data Flow (Before & After Fix)](#5-the-full-data-flow-before--after-fix)
6. [The Fix — What Was Done](#6-the-fix--what-was-done)
7. [Files Modified](#7-files-modified)
8. [Diagnostic Checklist](#8-diagnostic-checklist-if-bug-resurfaces)
9. [Frequently Asked Questions](#9-frequently-asked-questions)
10. [References](#10-references)

---

## 1. Executive Summary

**Problem:** Timestamps in the application were displaying **+5:30 hours ahead** of the actual time on some screens, and **−5:30 hours behind** on others.

**Root Cause:** Drizzle ORM **hardcodes UTC (`+0000`)** when reading `timestamp without time zone` values from PostgreSQL. Our database stores timestamps in **IST (Indian Standard Time, `+0530`)**. Drizzle has no configuration option to change this. Additionally, Drizzle **deliberately bypasses** any custom type parser set via the `pg` driver's `types.setTypeParser()`, making the standard fix ineffective.

**Impact:** Every timestamp displayed via a Drizzle ORM query was incorrect — shifted by exactly ±5 hours 30 minutes.

**Fix:** Patched Drizzle's internal `timestamp.js` file in `node_modules` to use `+0530` instead of `+0000` (read path) and to write IST wall-clock strings instead of UTC ISO strings (write path). A `postinstall` script ensures the patch survives `npm install`.

**Time to Resolve:** ~3 hours of systematic diagnosis.

---

## 2. The Symptom

| Screen | Expected Time | Displayed Time | Offset |
|--------|--------------|----------------|--------|
| Audit Trail / Timeline (System Admin) | `01:52 AM IST` | `07:22 AM IST` | **+5:30** |
| Owner Dashboard "Updated" field | `01:52 AM IST` | `08:22 PM (prev day)` | **−5:30** |
| DA Inspection Timeline | `01:52 AM IST` | `07:22 AM IST` | **+5:30** |

The inconsistency was confusing because:
- The **+5:30 shift** appeared on Drizzle-read timestamps (READ path issue)
- The **−5:30 shift** appeared on Drizzle-written timestamps that were then read back (combined WRITE + READ path issue)

---

## 3. Root Cause — Explained Simply

Think of it like this:

```
📦 PostgreSQL stores: "01:52" (meaning 1:52 AM IST — local India time)

🔴 Drizzle reads it and thinks:
   "01:52 must be UTC" → converts to → "07:22 IST" ← WRONG! (+5:30 ahead)

🟢 Correct interpretation:
   "01:52 is IST" → stays as → "01:52 IST" ← CORRECT!
```

And for writes:

```
📱 App creates: new Date() at 1:52 AM IST

🔴 Drizzle writes: "20:22 UTC" to database (via .toISOString())
   Next time DB is read with +0530 correction:
   "20:22" + "+0530" → 8:22 PM previous day ← WRONG!

🟢 Correct write:
   "01:52 IST" stored in database (matching what Postgres now() produces)
```

---

## 4. Root Cause — Deep Technical Analysis

### 4.1 The Architecture

```
┌──────────────────────────────────────────────────┐
│ PostgreSQL (timezone = Asia/Kolkata)              │
│                                                  │
│  Column Type: timestamp WITHOUT time zone        │
│  defaultNow() → now() → stores IST wall-clock   │
│  e.g., "2026-02-15 01:52:32"                     │
└────────────────────┬─────────────────────────────┘
                     │ Raw string: "2026-02-15 01:52:32"
                     ▼
┌──────────────────────────────────────────────────┐
│ pg Driver (node-postgres)                        │
│                                                  │
│  types.setTypeParser(1114, ...) ← we set +0530   │
│  BUT: Drizzle OVERRIDES this (see 4.2)           │
└────────────────────┬─────────────────────────────┘
                     │ Raw string unchanged
                     ▼
┌──────────────────────────────────────────────────┐
│ Drizzle ORM Session Layer                        │
│ (node_modules/drizzle-orm/node-postgres/         │
│  session.js, lines 22-38)                        │
│                                                  │
│  getTypeParser(typeId) {                         │
│    if (typeId === TIMESTAMP)                     │
│      return (val) => val;  ← RETURNS RAW STRING  │
│  }                                               │
│                                                  │
│  ⚠️ This BYPASSES pg's custom type parser!       │
└────────────────────┬─────────────────────────────┘
                     │ Raw string: "2026-02-15 01:52:32.941"
                     ▼
┌──────────────────────────────────────────────────┐
│ Drizzle Column Mapper                            │
│ (node_modules/drizzle-orm/pg-core/columns/       │
│  timestamp.js, line 31)                          │
│                                                  │
│  mapFromDriverValue = (value) => {               │
│    return new Date(value + "+0000"); ← HARDCODED │
│  }                                               │
│                                                  │
│  Result: new Date("2026-02-15 01:52:32.941+0000")│
│  = 01:52 UTC = 07:22 IST ← WRONG BY +5:30!      │
└──────────────────────────────────────────────────┘
```

### 4.2 Why `setTypeParser()` Doesn't Work

Many developers (and AI assistants) suggest fixing this via:

```typescript
import { types } from "pg";
types.setTypeParser(1114, (val) => new Date(val + "+05:30"));
```

**This does NOT work for Drizzle queries.** It only works for raw `pool.query()` calls.

Drizzle's `session.js` creates a per-query `types` override:

```javascript
// drizzle-orm/node-postgres/session.js (lines 22-38)
this.rawQueryConfig = {
  text: queryString,
  types: {
    getTypeParser: (typeId, format) => {
      if (typeId === types.builtins.TIMESTAMP) {
        return (val) => val; // ← Returns raw string, ignoring your parser
      }
      return types.getTypeParser(typeId, format); // Other types use default
    }
  }
};
```

This per-query `types` object **takes precedence** over the global `types.setTypeParser()`. It's a deliberate design choice by Drizzle to control its own timestamp parsing pipeline.

### 4.3 The Write Path Problem

Drizzle's `mapToDriverValue` (line 33-35 of `timestamp.js`):

```javascript
mapToDriverValue = (value) => {
    return value.toISOString(); // Always outputs UTC
};
```

When the application does:
```typescript
await db.update(homestayApplications)
  .set({ status: "pending", updatedAt: new Date() })
  .where(eq(id, appId));
```

At `01:52 IST`, `new Date().toISOString()` produces `"2026-02-14T20:22:32.936Z"`, and Postgres stores `2026-02-14 20:22:32` (stripping the `Z`). This is **UTC**, but `created_at` from `defaultNow()` is **IST** — creating a data inconsistency within the same row.

### 4.4 The Complete Bug Matrix

| Path | Source | Drizzle Behavior | Stored/Read As | Actual Time | Error |
|------|--------|-------------------|----------------|-------------|-------|
| **READ** | Postgres → App | Appends `+0000` | UTC | IST | **+5:30** |
| **WRITE (Drizzle)** | App → Postgres | `.toISOString()` | UTC string | IST intent | **−5:30** |
| **WRITE (Postgres)** | `defaultNow()` | N/A | IST string | IST | ✅ None |
| **READ raw pool** | `pool.query()` | N/A (uses our parser) | IST | IST | ✅ None |

---

## 5. The Full Data Flow (Before & After Fix)

### BEFORE Fix: `created_at` (set by Postgres `defaultNow()`)

```
Real time:        01:52 AM IST (Feb 15)
Postgres stores:  "2026-02-15 01:52:32"        ← IST wall-clock ✅
Drizzle reads:    new Date("...01:52:32+0000")  ← treated as UTC ❌
JS Date object:   01:52 UTC = 07:22 IST         ← +5:30 WRONG
JSON.stringify:   "2026-02-15T01:52:32.000Z"    ← client sees wrong UTC
Browser displays: 07:22 AM IST                  ← user sees +5:30 ❌
```

### BEFORE Fix: `updated_at` (set by Drizzle app code)

```
Real time:        01:52 AM IST (Feb 15)
new Date():       internally = 2026-02-14T20:22:32Z (correct UTC)
Drizzle writes:   .toISOString() → "2026-02-14T20:22:32.936Z"
Postgres stores:  "2026-02-14 20:22:32"        ← UTC wall-clock ⚠️ (wrong timezone!)
Drizzle reads:    new Date("...20:22:32+0000")  ← re-read as UTC, happens to cancel out
JSON.stringify:   "2026-02-14T20:22:32.000Z"    ← correct in original Drizzle
After READ fix:   new Date("...20:22:32+0530")  ← now shifted -5:30 ❌
Browser displays: 08:22 PM (Feb 14)             ← user sees -5:30 ❌
```

### AFTER Fix (both READ + WRITE):

```
Real time:        01:52 AM IST (Feb 15)

─── WRITE PATH ───
new Date():       internally = 2026-02-14T20:22:32Z (correct UTC)
Drizzle writes:   IST wall-clock → "2026-02-15T01:52:32.936" (no Z)
Postgres stores:  "2026-02-15 01:52:32"         ← IST wall-clock ✅

─── READ PATH ───
Drizzle reads:    new Date("...01:52:32+0530")   ← treated as IST ✅
JS Date object:   01:52 IST = 2026-02-14T20:22:32Z internally
JSON.stringify:   "2026-02-14T20:22:32.000Z"     ← correct UTC for transport
Browser receives: "2026-02-14T20:22:32.000Z"
Browser displays: 01:52 AM IST                   ← user sees correct time ✅
```

---

## 6. The Fix — What Was Done

### 6.1 Patch: Drizzle `timestamp.js` (READ + WRITE)

**File:** `node_modules/drizzle-orm/pg-core/columns/timestamp.js`

```javascript
// ── READ PATH ──────────────────────────────────────────
// BEFORE (broken):
mapFromDriverValue = (value) => {
    return new Date(this.withTimezone ? value : value + "+0000");
};

// AFTER (fixed):
mapFromDriverValue = (value) => {
    return new Date(this.withTimezone ? value : value + "+0530");
};

// ── WRITE PATH ─────────────────────────────────────────
// BEFORE (broken):
mapToDriverValue = (value) => {
    return value.toISOString();
};

// AFTER (fixed):
mapToDriverValue = (value) => {
    if (this.withTimezone) return value.toISOString();
    // For "timestamp without time zone": write IST wall-clock
    const istMs = value.getTime() + (5 * 60 + 30) * 60 * 1000;
    const ist = new Date(istMs);
    return ist.toISOString().slice(0, -1); // Remove trailing "Z"
};
```

### 6.2 Postinstall Script (Persistence)

**File:** `scripts/patch-drizzle-timestamp.sh`

This script runs automatically after every `npm install` to re-apply the patch:

```bash
#!/bin/bash
TARGET="node_modules/drizzle-orm/pg-core/columns/timestamp.js"

# Patch READ: +0000 → +0530
sed -i 's/value + "+0000"/value + "+0530"/g' "$TARGET"

# Patch WRITE: toISOString() → IST wall-clock
sed -i '/mapToDriverValue = (value) => {/{
  N
  s|mapToDriverValue = (value) => {\n    return value.toISOString();|mapToDriverValue = (value) => {\n    if (this.withTimezone) return value.toISOString();\n    const istMs = value.getTime() + (5 * 60 + 30) * 60 * 1000;\n    const ist = new Date(istMs);\n    return ist.toISOString().slice(0, -1);|
}' "$TARGET"
```

Registered in `package.json`:

```json
"postinstall": "bash scripts/patch-drizzle-timestamp.sh"
```

### 6.3 Raw `pool.query()` Parser (Belt & Suspenders)

**File:** `server/db.ts`

For any code using raw `pool.query()` instead of Drizzle:

```typescript
import { types } from "pg";

const TIMESTAMP_WITHOUT_TZ_OID = 1114;
types.setTypeParser(TIMESTAMP_WITHOUT_TZ_OID, (val: string): Date => {
  return new Date(val.replace(" ", "T") + "+05:30");
});
```

### 6.4 Environment Configuration

| Variable | Value | Set In |
|----------|-------|--------|
| `TZ` | `Asia/Kolkata` | `ecosystem.config.cjs` (PM2 env) |
| `PGTZ` | `Asia/Kolkata` | `ecosystem.config.cjs` + `.env` |
| PostgreSQL `timezone` | `Asia/Kolkata` | `postgresql.conf` |
| OS timezone | `Asia/Kolkata` | System (`/etc/localtime`) |

### 6.5 Data Migration (One-Time)

Existing `updated_at` and `submitted_at` values that were written as UTC by the old Drizzle code needed to be shifted +5:30 hours:

```sql
UPDATE homestay_applications
SET
  updated_at = updated_at + interval '5 hours 30 minutes',
  submitted_at = CASE
    WHEN submitted_at IS NOT NULL
    THEN submitted_at + interval '5 hours 30 minutes'
    ELSE submitted_at
  END
WHERE updated_at IS NOT NULL
AND updated_at != created_at;
-- 34 rows affected
```

---

## 7. Files Modified

| File | Change | Purpose |
|------|--------|---------|
| `node_modules/drizzle-orm/pg-core/columns/timestamp.js` | Patched `+0000` → `+0530`, patched `toISOString()` → IST wall-clock | Core fix (auto-applied by postinstall) |
| `scripts/patch-drizzle-timestamp.sh` | **NEW** — postinstall script | Ensures patch survives `npm install` |
| `package.json` | Added `"postinstall"` script | Triggers patch automatically |
| `server/db.ts` | `setTypeParser(1114, ...)` with `+05:30` | Fixes raw `pool.query()` calls |
| `ecosystem.config.cjs` | `TZ` and `PGTZ` = `Asia/Kolkata` | PM2 environment |
| `.env` | `PGTZ=Asia/Kolkata` | Environment variables |

---

## 8. Diagnostic Checklist (If Bug Resurfaces)

If timestamps appear wrong again, follow this checklist **in order**:

### Step 1: Verify the Drizzle Patch Is Applied

```bash
grep "+0530" node_modules/drizzle-orm/pg-core/columns/timestamp.js
grep "istMs" node_modules/drizzle-orm/pg-core/columns/timestamp.js
```

If either returns empty → **patch is missing**. Run:

```bash
bash scripts/patch-drizzle-timestamp.sh
npm run build && pm2 restart hptourism-dev1
```

### Step 2: Compare Drizzle vs Raw Pool Results

Create a quick test script:

```typescript
import { db, pool } from "../server/db";
import { applicationActions } from "@shared/schema";
import { desc } from "drizzle-orm";

const [drizzle] = await db.select().from(applicationActions)
  .orderBy(desc(applicationActions.createdAt)).limit(1);
const [raw] = (await pool.query(
  `SELECT created_at, to_char(created_at,'YYYY-MM-DD HH24:MI:SS') as raw
   FROM application_actions ORDER BY created_at DESC LIMIT 1`
)).rows;

console.log("Drizzle ISO:", drizzle.createdAt?.toISOString());
console.log("Pool ISO:   ", raw.created_at.toISOString());
console.log("DB Raw:     ", raw.raw);
console.log("Match:", drizzle.createdAt?.toISOString() === raw.created_at.toISOString());
```

✅ **Expected:** Both ISOs match, and interpreted time matches DB raw value.  
❌ **If mismatch:** Drizzle patch is not applied or has been overwritten.

### Step 3: Check System/DB Timezone

```bash
# OS
timedatectl | grep "Time zone"

# PostgreSQL
sudo -u postgres psql -d "hptourism-dev" -c "SHOW timezone;"

# PM2 Process
pm2 env 0 | grep -E "^(TZ|PGTZ)"
```

All should show `Asia/Kolkata`.

### Step 4: Check for UTC-Stored Data

```sql
-- Compare created_at (Postgres-generated, IST) vs updated_at (App-generated)
SELECT
  id,
  to_char(created_at, 'HH24:MI') as created,
  to_char(updated_at, 'HH24:MI') as updated,
  EXTRACT(EPOCH FROM (created_at - updated_at))/3600 as diff_hours
FROM homestay_applications
WHERE updated_at IS NOT NULL AND updated_at != created_at
AND ABS(EXTRACT(EPOCH FROM (created_at - updated_at))) BETWEEN 18000 AND 21600
LIMIT 5;
```

If you see rows with `diff_hours ≈ 5.5`, the write patch is not working — `updated_at` is being stored as UTC.

### Step 5: After `drizzle-orm` Upgrade

If you upgrade `drizzle-orm`, the patch might not apply cleanly. Check:

1. Does `timestamp.js` still have `mapFromDriverValue` and `mapToDriverValue`?
2. Does `session.js` still override `getTypeParser`?
3. Run the postinstall script and verify with Step 2.

---

## 9. Frequently Asked Questions

### Q: Why not just use `timestamp WITH time zone` instead?

Using `timestamptz` would be the PostgreSQL best practice and would eliminate this entire class of bugs. However:
- Our schema has **90+ timestamp columns** across 25+ tables
- Migrating column types in a live production system is risky
- All existing data would need careful handling
- The Drizzle patch is a reliable, lower-risk fix

### Q: Why does Drizzle bypass `pg`'s type parser?

Drizzle wants full control over type conversion. By intercepting the raw string, Drizzle can apply its own `mapFromDriverValue` / `mapToDriverValue` pipeline, which enables features like `mode: 'string'` and consistent serialization. The trade-off is that it silently ignores user-configured type parsers.

### Q: Will this break if Drizzle is upgraded?

Possibly. The `postinstall` script uses `sed` to find and replace specific patterns. If Drizzle changes the internal structure of `timestamp.js`, the script might fail. After any Drizzle upgrade:
1. Run: `bash scripts/patch-drizzle-timestamp.sh`
2. Check the output for "✅ Patched successfully" or "❌ Patch FAILED"
3. If it fails, manually inspect the new `timestamp.js` and update the sed patterns

### Q: Does this affect `timestamp with time zone` columns?

No. The `mapFromDriverValue` patch only applies when `this.withTimezone` is `false`. For `timestamptz` columns, Drizzle passes the value through unchanged (which includes the timezone offset from PostgreSQL), so those work correctly.

### Q: What about the client-side date formatting?

The client uses functions like `formatDateTimeLongIST()` and `formatDbTimestamp()` with `timeZone: "Asia/Kolkata"`. These are correct and don't need changes. The fix is entirely server-side — ensuring the JSON response contains correct UTC timestamps that the client then converts to IST for display.

### Q: What if we deploy to a server in a different timezone?

The patch hardcodes `+0530`. If the application is deployed on a server with a different timezone or the database timezone changes, the offset in both the Drizzle patch and `server/db.ts` must be updated accordingly. The `ecosystem.config.cjs` environment variables would also need to change.

---

## 10. References

- **Drizzle ORM source (session.js):** `node_modules/drizzle-orm/node-postgres/session.js` — lines 22-38 (type parser override)
- **Drizzle ORM source (timestamp.js):** `node_modules/drizzle-orm/pg-core/columns/timestamp.js` — `mapFromDriverValue` and `mapToDriverValue`
- **PostgreSQL timestamp handling:** [PostgreSQL Docs — Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
- **pg driver type OIDs:** OID `1114` = `timestamp without time zone`, OID `1184` = `timestamp with time zone`
- **Related Drizzle issues:** Search GitHub `drizzle-team/drizzle-orm` for "timestamp timezone"

---

*This document was created as a post-mortem after the timezone debugging session on 14-15 February 2026. The fix has been verified across all application screens — System Admin, DA, DTDO, and Owner dashboards.*
