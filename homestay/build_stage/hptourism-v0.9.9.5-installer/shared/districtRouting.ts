/**
 * District Routing Module - HP Homestay Portal
 * 
 * Maps owner's district/tehsil selection to the correct processing pipeline.
 * See: A.PMD/WorkFlow & Pipelines/workflow-pipelines.md
 * 
 * Pipeline Groups:
 * - Group A: 6 single-district pipelines (Kangra, Kinnaur, Kullu, Shimla, Sirmaur, Solan)
 * - Group B: 2 merged pipelines (Hamirpur+Una → Hamirpur, Bilaspur+Mandi → Bilaspur)
 * - Group C: 4 split pipelines (Chamba→Pangi, Lahaul-Spiti→Kaza)
 */

const normalizeValue = (value?: string | null) => value?.trim().toLowerCase() ?? "";

// Tehsil sets for Group C routing
const CHAMBA_PANGI_TEHSILS = new Set(["pangi"]);
const LAHAUL_SPITI_KAZA_TEHSILS = new Set(["kaza", "spiti"]);

// Canonical labels for all 12 pipelines
const canonicalLabels = {
  // Group A - Single District Pipelines
  kangra: "Kangra",
  kinnaur: "Kinnaur",
  kullu: "Kullu",
  shimla: "Shimla",
  sirmaur: "Sirmaur",
  solan: "Solan",

  // Group B - Merged Pipelines
  hamirpur: "Hamirpur",  // Receives: Hamirpur + Una
  bilaspur: "Bilaspur",  // Receives: Bilaspur + Mandi

  // Group C - Split Pipelines (Chamba)
  chamba: "Chamba",      // Receives: All Chamba tehsils except Pangi (including Bharmour)
  pangi: "Pangi",        // Receives: Pangi tehsil only (ITDP, 50% fee waiver)

  // Group C - Split Pipelines (Lahaul-Spiti)
  lahaul: "Lahaul",             // Receives: Lahaul + Udaipur tehsils
  kaza: "Lahaul-Spiti (Kaza)",  // Receives: Spiti tehsil only (ITDP)
};

// Group C: Chamba district routing based on tehsil
const resolveChambaRouting = (tehsil?: string | null): string => {
  const normalizedTehsil = normalizeValue(tehsil);
  if (CHAMBA_PANGI_TEHSILS.has(normalizedTehsil)) {
    return canonicalLabels.pangi;
  }
  // Bharmour and all other tehsils go to Chamba HQ
  return canonicalLabels.chamba;
};

// Group C: Lahaul-Spiti district routing based on tehsil
const resolveLahaulSpitiRouting = (tehsil?: string | null): string => {
  const normalizedTehsil = normalizeValue(tehsil);
  if (LAHAUL_SPITI_KAZA_TEHSILS.has(normalizedTehsil)) {
    return canonicalLabels.kaza;
  }
  return canonicalLabels.lahaul;
};

/**
 * Returns the canonical district routing label that should be stored on the application
 * and used for payment/DDO lookups and DA/DTDO assignment.
 * 
 * @param district - User's selected district (from LGD data)
 * @param tehsil - User's selected tehsil (required for Chamba and Lahaul-Spiti)
 * @returns Canonical routing label for pipeline assignment
 */
export const deriveDistrictRoutingLabel = (
  district?: string | null,
  tehsil?: string | null,
): string | undefined => {
  const normalizedDistrict = normalizeValue(district);
  if (!normalizedDistrict) {
    return district ?? undefined;
  }

  switch (normalizedDistrict) {
    // === Group B: Merged Districts ===
    case "una":
      return canonicalLabels.hamirpur; // Una → Hamirpur pipeline
    case "mandi":
      return canonicalLabels.bilaspur; // Mandi → Bilaspur pipeline

    // === Group C: Split Districts ===
    case "chamba":
      return resolveChambaRouting(tehsil);
    case "lahaul and spiti":
    case "lahaul & spiti":
    case "lahaul-spiti":
    case "lahaul spiti":
      return resolveLahaulSpitiRouting(tehsil);

    // === Group A + B Primary: Direct routing (pass through) ===
    // Kangra, Kinnaur, Kullu, Shimla, Sirmaur, Solan, Hamirpur, Bilaspur
    default:
      return district ?? undefined;
  }
};

/**
 * Check if a district/tehsil qualifies for Pangi sub-division fee waiver (50%)
 */
export const isPangiSubDivision = (
  district?: string | null,
  tehsil?: string | null,
): boolean => {
  const normalizedDistrict = normalizeValue(district);
  const normalizedTehsil = normalizeValue(tehsil);

  return normalizedDistrict === "chamba" && CHAMBA_PANGI_TEHSILS.has(normalizedTehsil);
};
