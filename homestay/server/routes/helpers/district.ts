import { eq, ilike, or, and, ne, isNull, type AnyColumn } from "drizzle-orm";
import { homestayApplications } from "@shared/schema";
import { getDistrictsCoveredBy } from "@shared/districtRouting";

export const normalizeDistrictForMatch = (value?: string | null) => {
  if (!value) return [];
  const cleaned = value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(division|sub-division|subdivision|hq|office|district|development|tourism|ddo|dto|dt|section|unit|range|circle|zone|serving|for|the|at|and)\b/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return [];
  }

  const tokens = cleaned
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 2);

  return Array.from(new Set(tokens));
};

export const districtsMatch = (officerDistrict?: string | null, targetDistrict?: string | null) => {
  const normalize = (val?: string | null) => (val ?? "").trim().toLowerCase();
  if (!officerDistrict || !targetDistrict) {
    return normalize(officerDistrict) === normalize(targetDistrict);
  }
  if (normalize(officerDistrict) === normalize(targetDistrict)) {
    return true;
  }
  const officerTokens = normalizeDistrictForMatch(officerDistrict);
  const targetTokens = normalizeDistrictForMatch(targetDistrict);
  if (officerTokens.length === 0 || targetTokens.length === 0) {
    return false;
  }
  return officerTokens.some((token) => targetTokens.includes(token));
};

export const buildDistrictWhereClause = <T extends AnyColumn>(column: T, officerDistrict: string) => {
  const tokens = normalizeDistrictForMatch(officerDistrict);
  if (tokens.length === 0) {
    return eq(column, officerDistrict);
  }
  return or(eq(column, officerDistrict), ...tokens.map((token) => ilike(column, `%${token}%`)));
};

export const buildCoveredDistrictsWhereClause = <T extends AnyColumn>(column: T, coveredDistricts: string[]) => {
  if (coveredDistricts.length === 0) {
    // Should fallback to matching nothing or everything? Probably nothing if no districts.
    // eq(column, "") creates a safe "match nothing" usually.
    return eq(column, "___NO_MATCH___");
  }

  // Build OR condition for each covered district
  const conditions = coveredDistricts.map((district) => {
    const tokens = normalizeDistrictForMatch(district);
    if (tokens.length === 0) {
      return eq(column, district);
    }
    return or(eq(column, district), ...tokens.map((token) => ilike(column, `%${token}%`)));
  });

  return or(...conditions);
};

/**
 * Build a SQL WHERE clause that respects split-district separation.
 * For Lahaul/Spiti and Chamba/Pangi, filters by BOTH district AND tehsil.
 * For all other districts, falls back to standard covered-districts logic.
 * 
 * Priority: Pangi → Lahaul → Chamba → Kaza/Spiti → Standard
 */
export const buildSplitDistrictWhereClause = (userDistrict: string) => {
  const districtLower = userDistrict.toLowerCase();

  if (districtLower.includes('pangi')) {
    // Pangi Pipeline: Chamba district + Pangi tehsil only
    return and(
      ilike(homestayApplications.district, '%chamba%'),
      ilike(homestayApplications.tehsil, '%pangi%')
    );
  } else if (districtLower.includes('kaza')) {
    // Spiti/Kaza Pipeline: Lahaul district + Spiti tehsil only
    // Note: We check 'kaza' specifically. checking 'spiti' is dangerous because "Lahaul and Spiti" contains it.
    return and(
      ilike(homestayApplications.district, '%lahaul%'),
      ilike(homestayApplications.tehsil, '%spiti%')
    );
  } else if (districtLower.includes('lahaul')) {
    // Lahaul Main Pipeline: Lahaul district EXCLUDING Spiti tehsil
    // Changed to NOT LIKE '%spiti%' to handle whitespace/casing/ambiguity
    return and(
      ilike(homestayApplications.district, '%lahaul%'),
      or(not(ilike(homestayApplications.tehsil, '%spiti%')), isNull(homestayApplications.tehsil))
    );
  } else if (districtLower.includes('chamba')) {
    // Chamba Main Pipeline: Chamba district EXCLUDING Pangi tehsil
    return and(
      ilike(homestayApplications.district, '%chamba%'),
      or(not(ilike(homestayApplications.tehsil, '%pangi%')), isNull(homestayApplications.tehsil))
    );
  } else {
    // Standard: Hamirpur(+Una), Mandi(+Bilaspur), Kangra, Shimla, etc.
    const coveredDistricts = getDistrictsCoveredBy(userDistrict);
    return buildCoveredDistrictsWhereClause(homestayApplications.district, coveredDistricts);
  }
};

/**
 * Check if a single application (by its district and tehsil) is covered by a DTDO officer.
 * Enforces the same split-district separation as buildSplitDistrictWhereClause.
 * Used for access control on individual application actions.
 */
export const isCoveredBySplitDistrict = (
  officerDistrict: string,
  appDistrict?: string | null,
  appTehsil?: string | null
): boolean => {
  const districtLower = officerDistrict.toLowerCase();
  const appDistLower = (appDistrict ?? "").toLowerCase();
  const appTehsilLower = (appTehsil ?? "").toLowerCase();

  if (districtLower.includes('pangi')) {
    // Pangi officer covers Chamba district + Pangi tehsil only
    return appDistLower.includes('chamba') && appTehsilLower.includes('pangi');
  } else if (districtLower.includes('kaza')) {
    // Spiti/Kaza covers Lahaul district + Spiti tehsil only
    return appDistLower.includes('lahaul') && appTehsilLower.includes('spiti');
  } else if (districtLower.includes('lahaul')) {
    // Lahaul Main covers Lahaul district EXCLUDING Spiti tehsil
    return appDistLower.includes('lahaul') && !appTehsilLower.includes('spiti');
  } else if (districtLower.includes('chamba')) {
    // Chamba Main covers Chamba district EXCLUDING Pangi tehsil
    return appDistLower.includes('chamba') && !appTehsilLower.includes('pangi');
  } else {
    // Standard: Use existing covered districts logic
    const coveredDistricts = getDistrictsCoveredBy(officerDistrict);
    return coveredDistricts.some(d => districtsMatch(d, appDistrict));
  }
};
