# PROD Data Integrity & User Alignment Guide
**Version:** 1.0.19 (Lahaul-Spiti DTDO Separation)
**Date:** 2026-02-10

## 1. Dealing Assistant (DA) & DTDO Assignment Rules

To ensure applications flow to the correct dashboard in Split Districts (Lahaul-Spiti, Chamba), strict separation is enforced for both DA and DTDO.

### Lahaul & Spiti District
*   **Main Office (Lahaul Pipeline):**
    *   Assign District: **"Lahaul"** OR **"Lahaul & Spiti"**.
    *   *Result:* Sees applications in district **EXCEPT** those marked 'Spiti' tehsil.
*   **Sub-Division Office (Spiti Pipeline):**
    *   Assign District: **"Spiti"** OR **"Kaza"**.
    *   *Result:* Sees **ONLY** applications with Tehsil = 'Spiti' (or 'Kaza').

### Chamba District
*   **Main DA (Chamba Pipeline):**
    *   Assign District: **"Chamba"**. (Avoid "Chamba & Pangi" to prevent Pangi pipeline trap).
    *   *Result:* Sees all applications in district EXCEPT those explicitly marked 'Pangi' tehsil.
*   **Sub-Division DA (Pangi Pipeline):**
    *   Assign District: **"Pangi"**.
    *   *Result:* Sees only applications with Tehsil = 'Pangi'.

---

## 2. Application Data Quality

### The "Tehsil" Field
*   **Requirement:** `tehsil` column in `homestay_applications` table should ideally NEVER be NULL.
*   **Legacy Issue:** Older records on PROD might have `tehsil = NULL`.
*   **Mitigation (v1.0.16+):** The system now treats `NULL` tehsils as belonging to the **Main Pipeline** (Lahaul or Chamba).
*   **Recommendation:** Run a database update to set NULL tehsils to a default (e.g., "Keylong" for Lahaul, "Chamba" for Chamba) for strict data cleanliness.

### Inspection Script
Use `scripts/debug-prod-status.ts` (provided) to check for NULL tehsils or DA misconfigurations.

---

## 3. Deployment Verification
After deploying v1.0.17+:
1.  Log in as **DA Lahaul**.
2.  Verify "Incoming Queue" shows applications (including those with missing Tehsil).
3.  Log in as **DA Kaza**.
4.  Verify they ONLY see Spiti apps.
