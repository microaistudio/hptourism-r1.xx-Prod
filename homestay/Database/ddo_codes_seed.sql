-- ============================================================
-- HP Tourism Homestay Portal - DDO Codes Seed Script
-- ============================================================
-- This script seeds the correct DDO codes for all 14 pipelines.
-- Safe to run multiple times (idempotent).
--
-- Usage:
--   sudo -u postgres psql -d hptourism -f ddo_codes_seed.sql
--
-- Last Updated: 2026-02-01
-- ============================================================

BEGIN;

-- Step 1: Clean up any incorrect/unused entries
DELETE FROM ddo_codes WHERE district IN (
    'Bharmour',
    'Kullu (Dhalpur)',
    'Shimla (Central)',
    'Lahaul and Spiti'  -- Replaced by Lahaul and Lahaul-Spiti (Kaza)
);

-- Step 2: Upsert all 14 DDO codes
-- Using INSERT ON CONFLICT for clean upsert

-- Chamba
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-chamba', 'Chamba', 'CHM00-532', 'D.T.D.O. CHAMBA', 'CHM00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Kangra
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-kangra', 'Kangra', 'KNG00-532', 'DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA', 'KNG00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Kinnaur
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-kinnaur', 'Kinnaur', 'KNR00-031', 'DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR AT RECKONG PEO', 'KNR00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Kullu
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-kullu', 'Kullu', 'KLU00-532', 'DEPUTY DIRECTOR TOURISM AND CIVIL AVIATION KULLU DHALPUR', 'KLU00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Mandi
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-mandi', 'Mandi', 'MDI00-532', 'DIV. TOURISM DEV. OFFICER MANDI', 'MDI00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Bilaspur (routes to Mandi DDO)
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-bilaspur', 'Bilaspur', 'MDI00-532', 'DIV. TOURISM DEV. OFFICER MANDI (BILASPUR)', 'MDI00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Shimla
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-shimla', 'Shimla', 'SML00-532', 'DIVISIONAL TOURISM OFFICER SHIMLA', 'SML00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Sirmaur
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-sirmaur', 'Sirmaur', 'SMR00-055', 'DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN', 'SMR00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Solan
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-solan', 'Solan', 'SOL00-046', 'DTDO SOLAN', 'SOL00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Hamirpur
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-hamirpur', 'Hamirpur', 'HMR00-053', 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR', 'HMR00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Una (routes to Hamirpur DDO)
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-una', 'Una', 'HMR00-053', 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)', 'HMR00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Pangi (ITDP - split from Chamba)
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-pangi', 'Pangi', 'PNG00-003', 'PROJECT OFFICER ITDP PANGI', 'PNG00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Lahaul (non-Spiti part of Lahaul and Spiti)
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-lahaul', 'Lahaul', 'LHL00-017', 'DISTRICT TOURISM DEVELOPMENT OFFICER KEYLONG', 'LHL00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

-- Lahaul-Spiti (Kaza) - ITDP for Spiti tehsil
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
VALUES ('ddo-kaza', 'Lahaul-Spiti (Kaza)', 'KZA00-011', 'PROJECT OFFICER ITDP KAZA', 'KZA00', true)
ON CONFLICT (id) DO UPDATE SET
    ddo_code = EXCLUDED.ddo_code,
    ddo_description = EXCLUDED.ddo_description,
    treasury_code = EXCLUDED.treasury_code;

COMMIT;

-- Verify the result
SELECT district, ddo_code, treasury_code, ddo_description 
FROM ddo_codes 
ORDER BY district;
