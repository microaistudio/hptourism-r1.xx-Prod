# HP Tourism Homestay Portal - Payment & DDO Codes

## Overview

This document defines the DDO (Drawing & Disbursing Officer) codes used for HimKosh payment gateway integration. Each DDO code routes payments to the correct treasury office based on the applicant's district.

## Pipeline Structure

### Standard Pipelines (10 Districts)
Each district has its own DDO and treasury code:

| District | DDO Code | Treasury | Description |
|----------|----------|----------|-------------|
| Chamba | CHM00-532 | CHM00 | D.T.D.O. CHAMBA |
| Kangra | KNG00-532 | KNG00 | DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA |
| Kinnaur | KNR00-031 | KNR00 | DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR AT RECKONG PEO |
| Kullu | KLU00-532 | KLU00 | DEPUTY DIRECTOR TOURISM AND CIVIL AVIATION KULLU DHALPUR |
| Mandi | MDI00-532 | MDI00 | DIV. TOURISM DEV. OFFICER MANDI |
| Shimla | SML00-532 | SML00 | DIVISIONAL TOURISM OFFICER SHIMLA |
| Sirmaur | SMR00-055 | SMR00 | DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN |
| Solan | SOL00-046 | SOL00 | DTDO SOLAN |
| Hamirpur | HMR00-053 | HMR00 | DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR |

### Merged Pipelines (2 Districts → Existing)
These districts route to an existing DDO:

| District | Routes To | DDO Code | Treasury |
|----------|-----------|----------|----------|
| **Bilaspur** | Mandi | MDI00-532 | MDI00 |
| **Una** | Hamirpur | HMR00-053 | HMR00 |

### Split Pipelines (Tribal/ITDP Areas)
These sub-divisions have their own DDO codes:

| Pipeline | Parent District | Tehsil | DDO Code | Treasury | Description |
|----------|-----------------|--------|----------|----------|-------------|
| **Pangi** | Chamba | Pangi | PNG00-003 | PNG00 | PROJECT OFFICER ITDP PANGI |
| **Lahaul** | Lahaul and Spiti | Lahaul, Udaipur | LHL00-017 | LHL00 | DISTRICT TOURISM DEVELOPMENT OFFICER KEYLONG |
| **Lahaul-Spiti (Kaza)** | Lahaul and Spiti | Spiti, Kaza | KZA00-011 | KZA00 | PROJECT OFFICER ITDP KAZA |

## Routing Logic

The routing is handled by `shared/districtRouting.ts`:

```
User selects District → deriveDistrictRoutingLabel() → Routed Label → DDO Lookup
```

### Examples:
- User selects `Chamba` + Tehsil `Pangi` → Routes to `Pangi` → DDO: `PNG00-003`
- User selects `Chamba` + Tehsil `Bharmour` → Routes to `Chamba` → DDO: `CHM00-532`
- User selects `Lahaul and Spiti` + Tehsil `Spiti` → Routes to `Lahaul-Spiti (Kaza)` → DDO: `KZA00-011`
- User selects `Lahaul and Spiti` + Tehsil `Lahaul` → Routes to `Lahaul` → DDO: `LHL00-017`
- User selects `Una` → Routes to `Hamirpur` → DDO: `HMR00-053`
- User selects `Bilaspur` → Routes to `Mandi` → DDO: `MDI00-532`

## Database Table: `ddo_codes`

| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key (e.g., `ddo-shimla`) |
| district | text | Routed district label (must match routing output) |
| ddo_code | text | HimKosh DDO identifier |
| ddo_description | text | Office name |
| treasury_code | text | Treasury prefix |
| is_active | boolean | Whether this DDO is active |

## Complete DDO Code Reference (14 Entries)

```sql
SELECT district, ddo_code, treasury_code FROM ddo_codes ORDER BY district;

      district       | ddo_code  | treasury_code
---------------------+-----------+---------------
 Bilaspur            | MDI00-532 | MDI00
 Chamba              | CHM00-532 | CHM00
 Hamirpur            | HMR00-053 | HMR00
 Kangra              | KNG00-532 | KNG00
 Kinnaur             | KNR00-031 | KNR00
 Kullu               | KLU00-532 | KLU00
 Lahaul              | LHL00-017 | LHL00
 Lahaul-Spiti (Kaza) | KZA00-011 | KZA00
 Mandi               | MDI00-532 | MDI00
 Pangi               | PNG00-003 | PNG00
 Shimla              | SML00-532 | SML00
 Sirmaur             | SMR00-055 | SMR00
 Solan               | SOL00-046 | SOL00
 Una                 | HMR00-053 | HMR00
```

## Head of Account

All DDO codes use the same Head of Account for registration fees:
- **Head1:** `1452-00-800-01` (Tourism - Homestay Registration)

## Seeding DDO Codes

Use the `ddo_codes_seed.sql` script in this directory to seed or fix DDO codes:

```bash
sudo -u postgres psql -d hptourism -f ddo_codes_seed.sql
```

---
*Last Updated: 2026-02-01*
