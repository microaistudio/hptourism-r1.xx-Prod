import { eq, ilike, or, type AnyColumn } from "drizzle-orm";

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
