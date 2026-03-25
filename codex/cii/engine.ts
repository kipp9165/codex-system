export type Workflow = {
  id: string;
  label: string;
};

export type Industry = {
  naics: string;
  name: string;
};

export type Archetype = {
  id: string;
  label: string;
};

export type IndustryProfile = {
  industry: Industry;
  archetype: Archetype | null;
  workflows: Workflow[];
};

const INDUSTRY_PROFILES: IndustryProfile[] = [
  {
    industry: { naics: "621", name: "Ambulatory Health Care Services" },
    archetype: { id: "regulated-service", label: "Regulated Service Provider" },
    workflows: [
      { id: "intake", label: "Patient intake and registration" },
      { id: "care-delivery", label: "Clinical care delivery" },
      { id: "billing", label: "Insurance billing and claims" },
      { id: "compliance", label: "Regulatory and compliance reporting" }
    ]
  },
  {
    industry: { naics: "541", name: "Professional, Scientific, and Technical Services" },
    archetype: { id: "expert-service", label: "Expert Service Firm" },
    workflows: [
      { id: "scoping", label: "Client scoping and engagement" },
      { id: "delivery", label: "Project and service delivery" },
      { id: "qa", label: "Quality assurance and review" },
      { id: "invoicing", label: "Invoicing and collections" }
    ]
  }
];

export function getIndustryProfile(naics: string): IndustryProfile | null {
  const normalized = naics.trim();
  const match =
    INDUSTRY_PROFILES.find((p) => p.industry.naics === normalized) ?? null;
  return match;
}
