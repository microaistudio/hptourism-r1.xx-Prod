# Pipeline: Virtual District Workflow

## Overview
This document outlines the architecture for handling "Virtual Districts" (e.g., Pangi, Kaza) which are routed independently in the backend but displayed as their legal parent districts (e.g., Chamba, Lahaul & Spiti) in the frontend.

## Goals
1. **Independent Routing**: Applications from special tehsils (Pangi, Kaza) flow to specialized pipelines.
2. **Unified Display**: Users and public interfaces always show the legal district name.
3. **Seamless Handling**: The system acts as if these are legal districts internally (for payments code, DDO mapping) but masks them externally.

## Architecture

### 1. Routing Logic (`shared/districtRouting.ts`)
The core logic resides here. It determines the "Routing Label" based on the user's District + Tehsil selection.

**Key Function:** `deriveDistrictRoutingLabel(district, tehsil)`
- **Pangi**: If District is "Chamba" AND Tehsil is "Pangi" ⇒ Returns `Pangi`.
- **Chamba (Standard)**: If District is "Chamba" AND Tehsil is NOT "Pangi" ⇒ Returns `Chamba`.
- **Kaza**: If District is "Lahaul & Spiti" AND Tehsil is "Kaza" or "Spiti" ⇒ Returns `Lahaul-Spiti (Kaza)`.

This "Routing Label" is stored in the database as the application's `district`.

### 2. Display Masking (`shared/districtRouting.ts`)
To prevent confusion, we mask these internal labels when showing data to users.

**Key Function:** `getDisplayDistrictLabel(district)`
- Input: `Pangi` → Output: `Chamba`
- Input: `Lahaul-Spiti (Kaza)` → Output: `Lahaul and Spiti`
- Input: `Hamirpur` → Output: `Hamirpur` (No change)

This function should be used in **ALL** frontend components that display the application's district.

### 3. Usage Locations (Frontend)
The masking is applied in:
- **Dashboard**: `client/src/pages/dtdo/dashboard.tsx` (Queue display)
- **Review Page**: `client/src/pages/dtdo/application-review.tsx` (Sidebar details)
- **Detail Page**: `client/src/pages/applications/detail.tsx` (Owner application view)
- **Tracking**: `client/src/pages/track-application.tsx` (Public tracking)
- **Certificates**: `client/src/lib/certificateGenerator.ts` (PDF Generation)

### 4. Database & Backend
- **Database**: The `users` table stores `district` as the Routing Label (e.g., `Pangi`).
- **DTDO Accounts**: Special accounts exist for these virtual districts:
  - `dtdo_pangi` (District: Pangi)
  - `dtdo_kaza` (District: Lahaul-Spiti (Kaza))

## Maintenance & Refactoring
If refactoring is needed in the future:
1. **Always** check `shared/districtRouting.ts` first.
2. **Do not** add ad-hoc `if (district === 'Pangi')` checks in components. Use `getDisplayDistrictLabel`.
3. **Database Changes**: If you rename a routing label, you must update the `users` table district field and the routing logic simultaneously.

## Known Virtual Districts
| Legal District | Tehsil Trigger | Routing Label | DTDO Account |
|---|---|---|---|
| Chamba | Pangi | `Pangi` | `dtdo_pangi` |
| Lahaul and Spiti | Kaza / Spiti | `Lahaul-Spiti (Kaza)` | `dtdo_kaza` |
| Hamirpur | (Merge: Una) | `Hamirpur` | `dtdo_hamirpur` |
| Bilaspur | (Merge: Mandi) | `Bilaspur` | `dtdo_bilaspur` |
