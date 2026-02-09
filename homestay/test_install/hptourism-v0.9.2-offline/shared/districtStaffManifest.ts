const normalizeStaffIdentifier = (value?: string | null): string | null => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }
  return trimmed.replace(/[.\s-]+/g, "_");
};

export type StaffRoleSlug = "dealing_assistant" | "district_tourism_officer";

export interface StaffAccountManifestEntry {
  districtLabel: string;
  ddoCode: string;
  isActive: boolean; // false = dormant account (reserved for future)
  da: {
    username: string;
    password: string;
    fullName: string;
    mobile: string;
    email: string;
  };
  dtdo: {
    username: string;
    password: string;
    fullName: string;
    mobile: string;
    email: string;
  };
}

const DISTRICT_STAFF_MANIFEST: StaffAccountManifestEntry[] = [
  // === Group C: Chamba District (Split Pipelines) ===
  {
    districtLabel: "Chamba",
    ddoCode: "CHM00-532",
    isActive: true, // Receives: Chamba + Bharmour (all tehsils except Pangi)
    da: {
      username: "da_chamba",
      password: "dacha@2025",
      fullName: "Dealing Assistant Chamba HQ",
      mobile: "7800001001",
      email: "da.chamba@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_chamba",
      password: "dtdocha@2025",
      fullName: "DTDO Chamba HQ",
      mobile: "7900001001",
      email: "dtdo.chamba@himachaltourism.gov.in",
    },
  },
  // DORMANT: Bharmour merged with Chamba HQ per 2025 workflow
  {
    districtLabel: "Bharmour Sub-Division",
    ddoCode: "CHM01-001",
    isActive: false, // DORMANT - Bharmour routes to Chamba HQ
    da: {
      username: "da_bharmour",
      password: "dabha@2025",
      fullName: "Dealing Assistant Bharmour",
      mobile: "7800001002",
      email: "da.bharmour@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_bharmour",
      password: "dtdobha@2025",
      fullName: "DTDO Bharmour",
      mobile: "7900001002",
      email: "dtdo.bharmour@himachaltourism.gov.in",
    },
  },

  // === Group B: Hamirpur + Una (Merged Pipeline) ===
  {
    districtLabel: "Hamirpur",
    ddoCode: "HMR00-053",
    isActive: true, // Receives: Hamirpur + Una applications
    da: {
      username: "da_hamirpur",
      password: "daham@2025",
      fullName: "Dealing Assistant Hamirpur",
      mobile: "7800001004",
      email: "da.hamirpur@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_hamirpur",
      password: "dtdoham@2025",
      fullName: "DTDO Hamirpur",
      mobile: "7900001004",
      email: "dtdo.hamirpur@himachaltourism.gov.in",
    },
  },
  // === Group A: Kullu (Single Pipeline) ===
  {
    districtLabel: "Kullu",
    ddoCode: "KLU00-532",
    isActive: true,
    da: {
      username: "da_kullu_manali",
      password: "dakul@2025",
      fullName: "Dealing Assistant Kullu",
      mobile: "7800001005",
      email: "da.kullu-manali@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_kullu_manali",
      password: "dtdokul@2025",
      fullName: "DTDO Kullu",
      mobile: "7900001005",
      email: "dtdo.kullu-manali@himachaltourism.gov.in",
    },
  },

  // === Group A: Kangra (Single Pipeline) ===
  {
    districtLabel: "Kangra",
    ddoCode: "KNG00-532",
    isActive: true,
    da: {
      username: "da_dharamsala",
      password: "dadha@2025",
      fullName: "Dealing Assistant Dharamsala",
      mobile: "7800001007",
      email: "da.dharamsala@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_dharamsala",
      password: "dtdodha@2025",
      fullName: "DTDO Dharamsala",
      mobile: "7900001007",
      email: "dtdo.dharamsala@himachaltourism.gov.in",
    },
  },
  // === Group A: Kinnaur (Single Pipeline) ===
  {
    districtLabel: "Kinnaur",
    ddoCode: "KNR00-031",
    isActive: true,
    da: {
      username: "da_kinnaur",
      password: "dakin@2025",
      fullName: "Dealing Assistant Kinnaur",
      mobile: "7800001008",
      email: "da.kinnaur@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_kinnaur",
      password: "dtdokin@2025",
      fullName: "DTDO Kinnaur",
      mobile: "7900001008",
      email: "dtdo.kinnaur@himachaltourism.gov.in",
    },
  },
  // === Group C: Lahaul-Spiti District (Kaza Pipeline) ===
  {
    districtLabel: "Lahaul-Spiti (Kaza)",
    ddoCode: "KZA00-011",
    isActive: true, // Receives: Spiti tehsil only (ITDP)
    da: {
      username: "da_kaza",
      password: "dakaz@2025",
      fullName: "Dealing Assistant Kaza",
      mobile: "7800001009",
      email: "da.kaza@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_kaza",
      password: "dtdokaz@2025",
      fullName: "DTDO Kaza",
      mobile: "7900001009",
      email: "dtdo.kaza@himachaltourism.gov.in",
    },
  },
  // === Group C: Lahaul-Spiti District (Lahaul Pipeline) ===
  {
    districtLabel: "Lahaul",
    ddoCode: "LHL00-017",
    isActive: true, // Receives: Lahaul + Udaipur tehsils
    da: {
      username: "da_lahaul",
      password: "dalah@2025",
      fullName: "Dealing Assistant Lahaul",
      mobile: "7800001010",
      email: "da.lahaul@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_lahaul",
      password: "dtdolah@2025",
      fullName: "DTDO Lahaul",
      mobile: "7900001010",
      email: "dtdo.lahaul@himachaltourism.gov.in",
    },
  },
  // DORMANT: Mandi merged with Bilaspur per 2025 workflow
  {
    districtLabel: "Mandi",
    ddoCode: "MDI00-532",
    isActive: false, // DORMANT - Mandi routes to Bilaspur
    da: {
      username: "da_mandi",
      password: "daman@2025",
      fullName: "Dealing Assistant Mandi",
      mobile: "7800001011",
      email: "da.mandi@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_mandi",
      password: "dtdoman@2025",
      fullName: "DTDO Mandi",
      mobile: "7900001011",
      email: "dtdo.mandi@himachaltourism.gov.in",
    },
  },
  // === Group C: Chamba District (Pangi Pipeline - ITDP) ===
  {
    districtLabel: "Pangi",
    ddoCode: "PNG00-003",
    isActive: true, // Receives: Pangi tehsil only (50% fee waiver)
    da: {
      username: "da_pangi",
      password: "dapan@2025",
      fullName: "Dealing Assistant Pangi",
      mobile: "7800001012",
      email: "da.pangi@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_pangi",
      password: "dtdopan@2025",
      fullName: "DTDO Pangi",
      mobile: "7900001012",
      email: "dtdo.pangi@himachaltourism.gov.in",
    },
  },
  // === Group A: Shimla (Single Pipeline) ===
  {
    districtLabel: "Shimla",
    ddoCode: "SML00-532",
    isActive: true,
    da: {
      username: "da_shimla",
      password: "dashi@2025",
      fullName: "Dealing Assistant Shimla",
      mobile: "7800001013",
      email: "da.shimla@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_shimla",
      password: "dtdoshi@2025",
      fullName: "DTDO Shimla",
      mobile: "7900001013",
      email: "dtdo.shimla@himachaltourism.gov.in",
    },
  },
  // === Group A: Sirmaur (Single Pipeline) ===
  {
    districtLabel: "Sirmaur",
    ddoCode: "SMR00-055",
    isActive: true,
    da: {
      username: "da_sirmaur",
      password: "dasir@2025",
      fullName: "Dealing Assistant Sirmaur",
      mobile: "7800001014",
      email: "da.sirmaur@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_sirmaur",
      password: "dtdosir@2025",
      fullName: "DTDO Sirmaur",
      mobile: "7900001014",
      email: "dtdo.sirmaur@himachaltourism.gov.in",
    },
  },
  // === Group A: Solan (Single Pipeline) ===
  {
    districtLabel: "Solan",
    ddoCode: "SOL00-046",
    isActive: true,
    da: {
      username: "da_solan",
      password: "dasol@2025",
      fullName: "Dealing Assistant Solan",
      mobile: "7800001015",
      email: "da.solan@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_solan",
      password: "dtdosol@2025",
      fullName: "DTDO Solan",
      mobile: "7900001015",
      email: "dtdo.solan@himachaltourism.gov.in",
    },
  },
  // === Group B: Bilaspur + Mandi (Merged Pipeline) ===
  {
    districtLabel: "Bilaspur",
    ddoCode: "BLS00-047",
    isActive: true, // Receives: Bilaspur + Mandi applications
    da: {
      username: "da_bilaspur",
      password: "dabil@2025",
      fullName: "Dealing Assistant Bilaspur",
      mobile: "7800001016",
      email: "da.bilaspur@himachaltourism.gov.in",
    },
    dtdo: {
      username: "dtdo_bilaspur",
      password: "dtdobil@2025",
      fullName: "DTDO Bilaspur",
      mobile: "7900001016",
      email: "dtdo.bilaspur@himachaltourism.gov.in",
    },
  },
];

export interface StaffAccountMeta {
  districtLabel: string;
  ddoCode: string;
  role: StaffRoleSlug;
  username: string;
  password: string;
  fullName: string;
  mobile: string;
  email: string;
}

const STAFF_BY_USERNAME = new Map<string, StaffAccountMeta>();
const STAFF_BY_MOBILE = new Map<string, StaffAccountMeta>();

for (const entry of DISTRICT_STAFF_MANIFEST) {
  for (const role of ["da", "dtdo"] as const) {
    const record = entry[role];
    const normalizedUsername = normalizeStaffIdentifier(record.username);
    if (normalizedUsername) {
      STAFF_BY_USERNAME.set(normalizedUsername, {
        districtLabel: entry.districtLabel,
        ddoCode: entry.ddoCode,
        role: role === "da" ? "dealing_assistant" : "district_tourism_officer",
        username: record.username,
        password: record.password,
        fullName: record.fullName,
        mobile: record.mobile,
        email: record.email,
      });
    }
    STAFF_BY_MOBILE.set(record.mobile, {
      districtLabel: entry.districtLabel,
      ddoCode: entry.ddoCode,
      role: role === "da" ? "dealing_assistant" : "district_tourism_officer",
      username: record.username,
      password: record.password,
      fullName: record.fullName,
      mobile: record.mobile,
      email: record.email,
    });
  }
}

export const lookupStaffAccountByIdentifier = (identifier?: string | null): StaffAccountMeta | undefined => {
  const normalized = normalizeStaffIdentifier(identifier);
  if (!normalized) return undefined;
  return STAFF_BY_USERNAME.get(normalized);
};

export const lookupStaffAccountByMobile = (mobile?: string | null): StaffAccountMeta | undefined => {
  if (!mobile) return undefined;
  return STAFF_BY_MOBILE.get(mobile);
};

export const getManifestDerivedUsername = (mobile?: string | null, fallback?: string | null): string | null => {
  if (fallback && fallback.trim().length > 0) {
    return fallback;
  }
  const entry = lookupStaffAccountByMobile(mobile);
  return entry?.username ?? null;
};

/**
 * Look up DTDO info by district label
 * Used for OTP verification when DA needs DTDO approval
 */
export const lookupDtdoByDistrictLabel = (districtLabel?: string | null): {
  fullName: string;
  mobile: string;
  email: string;
  districtLabel: string;
} | undefined => {
  if (!districtLabel) return undefined;

  // Try exact match first
  for (const entry of DISTRICT_STAFF_MANIFEST) {
    if (entry.districtLabel.toLowerCase() === districtLabel.toLowerCase()) {
      return {
        fullName: entry.dtdo.fullName,
        mobile: entry.dtdo.mobile,
        email: entry.dtdo.email,
        districtLabel: entry.districtLabel,
      };
    }
  }

  // Try partial match (e.g., "Shimla" matches "Shimla Division")
  const normalized = districtLabel.toLowerCase().replace(/[^a-z]/g, "");
  for (const entry of DISTRICT_STAFF_MANIFEST) {
    const entryNormalized = entry.districtLabel.toLowerCase().replace(/[^a-z]/g, "");
    if (entryNormalized.includes(normalized) || normalized.includes(entryNormalized.slice(0, 5))) {
      return {
        fullName: entry.dtdo.fullName,
        mobile: entry.dtdo.mobile,
        email: entry.dtdo.email,
        districtLabel: entry.districtLabel,
      };
    }
  }

  return undefined;
};

export const getDistrictStaffManifest = (): readonly StaffAccountManifestEntry[] => DISTRICT_STAFF_MANIFEST;

