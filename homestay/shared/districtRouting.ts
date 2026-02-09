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
    // FIX (2025-02-01): Identity Preservation
    // Do NOT return the pipeline name here. Return undefined so the original district is stored.
    // The "Routing" happens purely in getDistrictsCoveredBy for dashboard visibility.
    case "una":
    case "bilaspur":
      return undefined; // Handled by bidirectional lookup in getDistrictsCoveredBy

    // === Group C: Split Districts ===
    // These MUST separate because "Pangi" is a distinct jurisdiction within Chamba for fees.
    case "chamba":
      return resolveChambaRouting(tehsil);
    case "lahaul and spiti":
    case "lahaul & spiti":
    case "lahaul-spiti":
    case "lahaul spiti":
      return resolveLahaulSpitiRouting(tehsil);

    // === Group A + B Primary: Direct routing ===
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

/**
 * Returns a list of all raw districts covered by a specific DTDO office.
 * Used for querying applications in the dashboard.
 * 
 * @param officerDistrict - The district assigned to the DTDO officer
 * @returns Array of districts (including the officer's own) that route to this office
 */
export const getDistrictsCoveredBy = (officerDistrict?: string | null): string[] => {
  const normalized = normalizeValue(officerDistrict);
  if (!normalized) return [];

  // Always include self
  const covered = [officerDistrict!];

  // Add covered districts based on pipeline logic
  // Merged pipelines are bidirectional or directed based on "Processing Office"
  switch (normalized) {
    case "hamirpur":
      covered.push("Una"); // Hamirpur processes Una
      break;
    case "una":
      // Optional: If Una officer logs in (conceptually), they should see Una.
      // But practically Una office is closed/merged. 
      // User requested "Una is merged with Hamirpur", usually implies Hamirpur officer does the work.
      // We keep bidirectional just in case.
      covered.push("Hamirpur");
      break;

    // FIX (2025-02-01): Mandi processes Bilaspur (Swapped from previous wrong implementation)
    case "mandi":
      covered.push("Bilaspur"); // Mandi processes Bilaspur
      break;
    case "bilaspur":
      covered.push("Mandi");
      break;

    case "chamba":
      // Chamba covers Bharmour (already part of Chamba district) but conceptually distinct in old data?
      // For now, Chamba usually just covers "Chamba" unless there are specific "Bharmour" labelled apps.
      break;
  }

  return covered;
};

/**
 * Returns the canonical processing office (DTDO district) for a given application's district.
 * Used for OTP verification, notifications, and workflow assignments.
 * 
 * This resolves merged districts:
 * - Bilaspur applications → processed by Mandi DTDO
 * - Una applications → processed by Hamirpur DTDO
 * - Pangi applications → processed by Pangi DTDO (split from Chamba)
 * - Kaza applications → processed by Kaza DTDO (split from Lahaul-Spiti)
 * 
 * @param district - The application's district (e.g., "Bilaspur", "Una")
 * @param tehsil - The application's tehsil (optional, for Chamba/Lahaul-Spiti splits)
 * @returns The processing office district label (e.g., "Mandi", "Hamirpur")
 */
export const getProcessingOffice = (
  district?: string | null,
  tehsil?: string | null
): string | undefined => {
  const normalized = normalizeValue(district);
  if (!normalized) return district ?? undefined;

  switch (normalized) {
    // === Group B: Merged Districts ===
    // Bilaspur is in Mandi territory → Mandi DTDO handles it
    case "bilaspur":
      return "Mandi";

    // Una is merged with Hamirpur → Hamirpur DTDO handles it
    case "una":
      return "Hamirpur";

    // === Group C: Split Districts (tehsil-based) ===
    case "chamba":
      // Pangi tehsil has its own DTDO
      return resolveChambaRouting(tehsil);

    case "lahaul and spiti":
    case "lahaul & spiti":
    case "lahaul-spiti":
    case "lahaul spiti":
      // Kaza/Spiti tehsil has its own DTDO
      return resolveLahaulSpitiRouting(tehsil);

    // === All other districts: Direct processing ===
    default:
      return district ?? undefined;
  }
};

/**
 * Returns the customized display label for a routed district.
 * Used for masking internal routing districts (Pangi -> Chamba) in the UI.
 * 
 * @param district - The raw routing district (e.g. "Pangi", "Kaza")
 * @returns The user-facing display name (e.g. "Chamba", "Lahaul and Spiti")
 */
export const getDisplayDistrictLabel = (district?: string | null): string => {
  const d = normalizeValue(district);
  if (d === "pangi") return "Chamba";
  if (d === "kaza" || d === "spiti" || d.includes("kaza") || d === "lahaul") return "Lahaul and Spiti";
  return district || "";
};
