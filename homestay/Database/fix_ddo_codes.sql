-- DDO Codes Fix Script for HP Tourism Homestay Portal
-- Run this on BOTH DEV1 and PROD databases
-- 
-- Pipeline Structure:
-- - 12 standard districts (each with own DDO)
-- - Pangi (ITDP split from Chamba)  
-- - Lahaul (non-Spiti part of Lahaul and Spiti)
-- - Lahaul-Spiti (Kaza) (Spiti tehsil - ITDP)
-- - Bilaspur → uses Mandi DDO (merged)
-- - Una → uses Hamirpur DDO (merged)

BEGIN;

-- Delete any extra/unused entries (Bharmour, Kullu Dhalpur, Shimla Central, Lahaul and Spiti)
DELETE FROM ddo_codes WHERE district IN ('Bharmour', 'Kullu (Dhalpur)', 'Shimla (Central)', 'Lahaul and Spiti');

-- =====================================================
-- STANDARD 12 DISTRICT DDO CODES
-- =====================================================

-- Chamba
UPDATE ddo_codes SET ddo_code = 'CHM00-532', ddo_description = 'D.T.D.O. CHAMBA', treasury_code = 'CHM00' WHERE district = 'Chamba';

-- Kangra
UPDATE ddo_codes SET ddo_code = 'KNG00-532', ddo_description = 'DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA', treasury_code = 'KNG00' WHERE district = 'Kangra';

-- Kinnaur
UPDATE ddo_codes SET ddo_code = 'KNR00-031', ddo_description = 'DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR AT RECKONG PEO', treasury_code = 'KNR00' WHERE district = 'Kinnaur';

-- Kullu
UPDATE ddo_codes SET ddo_code = 'KLU00-532', ddo_description = 'DEPUTY DIRECTOR TOURISM AND CIVIL AVIATION KULLU DHALPUR', treasury_code = 'KLU00' WHERE district = 'Kullu';

-- Mandi (receives Bilaspur applications)
UPDATE ddo_codes SET ddo_code = 'MDI00-532', ddo_description = 'DIV. TOURISM DEV. OFFICER MANDI', treasury_code = 'MDI00' WHERE district = 'Mandi';

-- Bilaspur (uses Mandi DDO - same code)
UPDATE ddo_codes SET ddo_code = 'MDI00-532', ddo_description = 'DIV. TOURISM DEV. OFFICER MANDI (BILASPUR)', treasury_code = 'MDI00' WHERE district = 'Bilaspur';

-- Shimla
UPDATE ddo_codes SET ddo_code = 'SML00-532', ddo_description = 'DIVISIONAL TOURISM OFFICER SHIMLA', treasury_code = 'SML00' WHERE district = 'Shimla';

-- Sirmaur (handle both spellings)
UPDATE ddo_codes SET ddo_code = 'SMR00-055', ddo_description = 'DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN', treasury_code = 'SMR00' WHERE district IN ('Sirmaur', 'Sirmour');

-- Solan
UPDATE ddo_codes SET ddo_code = 'SOL00-046', ddo_description = 'DTDO SOLAN', treasury_code = 'SOL00' WHERE district = 'Solan';

-- Hamirpur (receives Una applications)
UPDATE ddo_codes SET ddo_code = 'HMR00-053', ddo_description = 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR', treasury_code = 'HMR00' WHERE district = 'Hamirpur';

-- Una (uses Hamirpur DDO - same code)
UPDATE ddo_codes SET ddo_code = 'HMR00-053', ddo_description = 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)', treasury_code = 'HMR00' WHERE district = 'Una';

-- Lahaul and Spiti base (update if exists)
UPDATE ddo_codes SET ddo_code = 'LHL00-017', ddo_description = 'DISTRICT TOURISM DEVELOPMENT OFFICER KEYLONG', treasury_code = 'LHL00' WHERE district = 'Lahaul and Spiti';

-- =====================================================
-- SPLIT PIPELINE DDO CODES (Tribal/ITDP areas)
-- =====================================================

-- Pangi (ITDP - split from Chamba for Pangi tehsil)
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
SELECT 'ddo-pangi', 'Pangi', 'PNG00-003', 'PROJECT OFFICER ITDP PANGI', 'PNG00', true
WHERE NOT EXISTS (SELECT 1 FROM ddo_codes WHERE district = 'Pangi');

UPDATE ddo_codes SET ddo_code = 'PNG00-003', ddo_description = 'PROJECT OFFICER ITDP PANGI', treasury_code = 'PNG00' WHERE district = 'Pangi';

-- Lahaul (non-Spiti part of Lahaul and Spiti district)
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
SELECT 'ddo-lahaul-only', 'Lahaul', 'LHL00-017', 'DISTRICT TOURISM DEVELOPMENT OFFICER KEYLONG', 'LHL00', true
WHERE NOT EXISTS (SELECT 1 FROM ddo_codes WHERE district = 'Lahaul');

UPDATE ddo_codes SET ddo_code = 'LHL00-017', ddo_description = 'DISTRICT TOURISM DEVELOPMENT OFFICER KEYLONG', treasury_code = 'LHL00' WHERE district = 'Lahaul';

-- Lahaul-Spiti (Kaza) - ITDP for Spiti tehsil
INSERT INTO ddo_codes (id, district, ddo_code, ddo_description, treasury_code, is_active)
SELECT 'ddo-kaza', 'Lahaul-Spiti (Kaza)', 'KZA00-011', 'PROJECT OFFICER ITDP KAZA', 'KZA00', true
WHERE NOT EXISTS (SELECT 1 FROM ddo_codes WHERE district = 'Lahaul-Spiti (Kaza)');

UPDATE ddo_codes SET ddo_code = 'KZA00-011', ddo_description = 'PROJECT OFFICER ITDP KAZA', treasury_code = 'KZA00' WHERE district = 'Lahaul-Spiti (Kaza)';

COMMIT;

-- Verify the fix - show all DDO codes
SELECT district, ddo_code, ddo_description, treasury_code FROM ddo_codes ORDER BY district;
