/**
 * Organization Branding Configuration
 * 
 * Maps Auth0 Organization IDs to brand-specific theming.
 * Each brand has its own color palette, logo, and support URL.
 * 
 * Model: 3 Brands × N Countries = N Auth0 Organizations
 * - fluidra-es, fluidra-pt, fluidra-de, fluidra-nordics, ...
 * - grepool-es, grepool-pt, ...
 * - astralpool-es, astralpool-uk, ...
 */

export interface OrganizationBranding {
  brandId: string;
  brandName: string;
  displayName: string;
  country: string;
  language: string;
  logoUrl: string;
  supportUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bgPrimary: string;
    bgSecondary: string;
    bgSidebar: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  applications: ApplicationAccess[];
}

export interface ApplicationAccess {
  id: string;
  name: string;
  description: string;
  icon: string;
  url?: string;
}

// Available applications
export const APPLICATIONS: Record<string, ApplicationAccess> = {
  esales: {
    id: "esales",
    name: "eSales",
    description: "Order management and ERP integration",
    icon: "🛒",
  },
  mediaCenter: {
    id: "mediaCenter",
    name: "Media Center",
    description: "Marketing materials and product documentation",
    icon: "📚",
  },
  proAcademy: {
    id: "proAcademy",
    name: "Pro Academy",
    description: "Training courses and certifications",
    icon: "🎓",
  },
  proLab: {
    id: "proLab",
    name: "Pro Lab",
    description: "Technical tools and diagnostics",
    icon: "🔬",
  },
  proApp: {
    id: "proApp",
    name: "Pro App",
    description: "Mobile field service application",
    icon: "📱",
  },
};

// Role to application access mapping
// Auth0 Roles: admin, b2b_customer, buyer
export const ROLE_APP_ACCESS: Record<string, string[]> = {
  buyer: ["esales"],
  b2b_customer: ["mediaCenter", "proAcademy", "proLab"],
  admin: ["esales", "mediaCenter", "proAcademy", "proLab", "proApp"],
};

// Brand base configurations
const BRAND_CONFIGS = {
  fluidra: {
    brandId: "fluidra",
    brandName: "Fluidra",
    logoUrl: "https://www.fluidra.com/wp-content/uploads/2024/07/Logo.webp",
    supportUrl: "https://www.fluidra.com/support",
    theme: {
      primaryColor: "#005BAC",
      secondaryColor: "#00A3E0",
      bgPrimary: "#1a1e27",
      bgSecondary: "#262a33",
      bgSidebar: "#0d2137",
      textPrimary: "#f7fafc",
      textSecondary: "#e2e8f0",
      textMuted: "#a0aec0",
    },
    applications: [
      APPLICATIONS.esales,
      APPLICATIONS.mediaCenter,
      APPLICATIONS.proAcademy,
      APPLICATIONS.proLab,
      APPLICATIONS.proApp,
    ],
  },
  grepool: {
    brandId: "grepool",
    brandName: "Grepool",
    logoUrl: "https://www.depozitpiscine.ro/ProducerContentFileHandler/600/600/gre-48.jpeg",
    supportUrl: "https://www.grepool.com/support",
    theme: {
      primaryColor: "#ED8936",
      secondaryColor: "#F6AD55",
      bgPrimary: "#1a1e27",
      bgSecondary: "#262a33",
      bgSidebar: "#2d2418",
      textPrimary: "#f7fafc",
      textSecondary: "#e2e8f0",
      textMuted: "#a0aec0",
    },
    applications: [
      APPLICATIONS.esales,
      APPLICATIONS.mediaCenter,
    ],
  },
  astralpool: {
    brandId: "astralpool",
    brandName: "AstralPool",
    logoUrl: "https://www.astralpool.com/content/dam/astralpool/logo/logo-astralpool.svg",
    supportUrl: "https://www.astralpool.com/support",
    theme: {
      primaryColor: "#00875A",
      secondaryColor: "#38A169",
      bgPrimary: "#1a1e27",
      bgSecondary: "#262a33",
      bgSidebar: "#0d2d22",
      textPrimary: "#f7fafc",
      textSecondary: "#e2e8f0",
      textMuted: "#a0aec0",
    },
    applications: [
      APPLICATIONS.esales,
      APPLICATIONS.mediaCenter,
      APPLICATIONS.proAcademy,
    ],
  },
};

// Country configurations
const COUNTRY_CONFIGS: Record<string, { name: string; language: string }> = {
  es: { name: "Spain", language: "es" },
  pt: { name: "Portugal", language: "pt" },
  de: { name: "Germany", language: "de" },
  fr: { name: "France", language: "fr" },
  uk: { name: "United Kingdom", language: "en" },
  nordics: { name: "Nordics", language: "en" },
  it: { name: "Italy", language: "it" },
  nl: { name: "Netherlands", language: "nl" },
};

/**
 * Generate organization branding for a brand + country combination
 */
function createOrgBranding(
  brandKey: keyof typeof BRAND_CONFIGS,
  countryCode: string
): OrganizationBranding {
  const brand = BRAND_CONFIGS[brandKey];
  const country = COUNTRY_CONFIGS[countryCode] || { name: countryCode.toUpperCase(), language: "en" };

  return {
    ...brand,
    displayName: `${brand.brandName} ${country.name}`,
    country: countryCode,
    language: country.language,
  };
}

/**
 * Auth0 Organization ID mappings
 * Maps org names to their Auth0 org_id values
 * 
 * Currently configured for Spain (ES) only.
 * Add more entries when you create additional country orgs in Auth0.
 */
export const ORG_IDS: Record<string, string> = {
  "fluidra-es": "org_RivztKsZ841qo1JG",
  "grepool-es": "org_xs1zrgSOKLxP48L1",
  "astralpool-es": "org_LzBQvQESaJPNx3f6",
};

/**
 * Reverse lookup: org_id to org name
 */
export const ORG_ID_TO_NAME: Record<string, string> = Object.entries(ORG_IDS).reduce(
  (acc, [name, id]) => {
    acc[id] = name;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Get the Auth0 org_id for a given org name
 */
export function getOrgId(orgName: string): string {
  return ORG_IDS[orgName] || orgName;
}

/**
 * Organization branding lookup by org_id or org_name
 * 
 * This maps Auth0 organization identifiers to their branding configuration.
 * The key can be either the org_id (e.g., "org_abc123") or the org name (e.g., "fluidra-es").
 * 
 * Currently configured for Spain (ES) only - 3 orgs total.
 */
export const ORGANIZATION_BRANDING: Record<string, OrganizationBranding> = {
  // Fluidra Spain
  "fluidra-es": createOrgBranding("fluidra", "es"),
  "org_RivztKsZ841qo1JG": createOrgBranding("fluidra", "es"),

  // Grepool Spain  
  "grepool-es": createOrgBranding("grepool", "es"),
  "org_xs1zrgSOKLxP48L1": createOrgBranding("grepool", "es"),

  // AstralPool Spain
  "astralpool-es": createOrgBranding("astralpool", "es"),
  "org_LzBQvQESaJPNx3f6": createOrgBranding("astralpool", "es"),
};

/**
 * Get branding for an organization by ID or name
 * Falls back to Fluidra default if not found
 */
export function getOrganizationBranding(orgIdentifier: string): OrganizationBranding | null {
  // Direct lookup by org name (e.g., "fluidra-es")
  if (ORGANIZATION_BRANDING[orgIdentifier]) {
    return ORGANIZATION_BRANDING[orgIdentifier];
  }

  // Try to parse brand from identifier (e.g., "org_fluidra_es" or custom org_id)
  const lowerId = orgIdentifier.toLowerCase();
  for (const [key, branding] of Object.entries(ORGANIZATION_BRANDING)) {
    if (lowerId.includes(key.replace("-", "_")) || lowerId.includes(key)) {
      return branding;
    }
  }

  return null;
}

/**
 * Get all organizations for a specific brand
 */
export function getOrganizationsByBrand(brandId: string): OrganizationBranding[] {
  return Object.values(ORGANIZATION_BRANDING).filter(
    (org) => org.brandId === brandId
  );
}

/**
 * Get available brands for the brand picker
 */
export function getAvailableBrands() {
  return [
    {
      id: "fluidra",
      name: "Fluidra",
      logoUrl: BRAND_CONFIGS.fluidra.logoUrl,
      primaryColor: BRAND_CONFIGS.fluidra.theme.primaryColor,
      countries: getOrganizationsByBrand("fluidra").map((org) => {
        const orgName = `fluidra-${org.country}`;
        return {
          code: org.country,
          name: COUNTRY_CONFIGS[org.country]?.name || org.country,
          orgName,
          orgId: getOrgId(orgName),
        };
      }),
    },
    {
      id: "grepool",
      name: "Grepool",
      logoUrl: BRAND_CONFIGS.grepool.logoUrl,
      primaryColor: BRAND_CONFIGS.grepool.theme.primaryColor,
      countries: getOrganizationsByBrand("grepool").map((org) => {
        const orgName = `grepool-${org.country}`;
        return {
          code: org.country,
          name: COUNTRY_CONFIGS[org.country]?.name || org.country,
          orgName,
          orgId: getOrgId(orgName),
        };
      }),
    },
    {
      id: "astralpool",
      name: "AstralPool",
      logoUrl: BRAND_CONFIGS.astralpool.logoUrl,
      primaryColor: BRAND_CONFIGS.astralpool.theme.primaryColor,
      countries: getOrganizationsByBrand("astralpool").map((org) => {
        const orgName = `astralpool-${org.country}`;
        return {
          code: org.country,
          name: COUNTRY_CONFIGS[org.country]?.name || org.country,
          orgName,
          orgId: getOrgId(orgName),
        };
      }),
    },
  ];
}

/**
 * Get applications a user can access based on their roles
 */
export function getAccessibleApplications(roles: string[]): ApplicationAccess[] {
  const accessibleAppIds = new Set<string>();

  for (const role of roles) {
    const apps = ROLE_APP_ACCESS[role.toLowerCase()] || [];
    apps.forEach((appId) => accessibleAppIds.add(appId));
  }

  return Array.from(accessibleAppIds).map((appId) => APPLICATIONS[appId]).filter(Boolean);
}

export { BRAND_CONFIGS, COUNTRY_CONFIGS };
