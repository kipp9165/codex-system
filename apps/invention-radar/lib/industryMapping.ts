import { getIndustryProfile } from "../../../codex/cii/engine";

export type InventionIndustryContext = {
  naics: string;
  name: string;
  archetypeLabel: string | null;
};

export function mapInventionToIndustry(
  naics: string
): InventionIndustryContext | null {
  const profile = getIndustryProfile(naics);
  if (!profile) return null;

  return {
    naics,
    name: profile.industry.name,
    archetypeLabel: profile.archetype ? profile.archetype.label : null
  };
}
