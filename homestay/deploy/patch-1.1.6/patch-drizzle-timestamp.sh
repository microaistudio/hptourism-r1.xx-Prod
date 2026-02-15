#!/bin/bash
# ─── Drizzle ORM Timestamp Patch (IST) ─────────────────────────────────
# Drizzle ORM's node-postgres driver deliberately bypasses pg's custom
# type parsers for TIMESTAMP/TIMESTAMPTZ columns (session.js lines 24-38).
# It then internally parses timestamp-without-timezone strings by appending
# "+0000" (UTC), which is WRONG for our DB that stores IST wall-clock times.
#
# This patch fixes BOTH the read and write paths:
#
# READ:  mapFromDriverValue changes "+0000" → "+0530"
#        Raw DB value "01:49:21" is correctly interpreted as 01:49 IST
#
# WRITE: mapToDriverValue changes toISOString() → IST wall-clock string
#        new Date() at 01:52 IST writes "01:52:32" (not "20:22:32" UTC)
#        This matches what Postgres defaultNow() produces in IST timezone.
#
# Without this patch:
# - READ:  All Drizzle timestamps display +5:30 hours ahead
# - WRITE: updated_at fields stored as UTC while created_at is IST
# ──────────────────────────────────────────────────────────────────────

TARGET="node_modules/drizzle-orm/pg-core/columns/timestamp.js"

if [ ! -f "$TARGET" ]; then
  echo "[patch-drizzle-timestamp] SKIP: $TARGET not found"
  exit 0
fi

# Check if already fully patched
if grep -q '+0530' "$TARGET" && grep -q 'istMs' "$TARGET"; then
  echo "[patch-drizzle-timestamp] Already patched (read + write)."
  exit 0
fi

# Patch READ path: +0000 → +0530
sed -i 's/value + "+0000"/value + "+0530"/g' "$TARGET"

# Patch WRITE path: toISOString() → IST wall-clock
# Replace the simple mapToDriverValue with IST-aware version
sed -i '/mapToDriverValue = (value) => {/{
  N
  s|mapToDriverValue = (value) => {\n    return value.toISOString();|mapToDriverValue = (value) => {\n    if (this.withTimezone) return value.toISOString();\n    const istMs = value.getTime() + (5 * 60 + 30) * 60 * 1000;\n    const ist = new Date(istMs);\n    return ist.toISOString().slice(0, -1);|
}' "$TARGET"

# Verify
if grep -q '+0530' "$TARGET" && grep -q 'istMs' "$TARGET"; then
  echo "[patch-drizzle-timestamp] ✅ Patched successfully (read + write)."
else
  echo "[patch-drizzle-timestamp] ❌ Patch may be incomplete. Check $TARGET manually."
  exit 1
fi
