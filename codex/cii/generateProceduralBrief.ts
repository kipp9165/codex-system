import { getIndustryProfile } from "./engine";

export type ProceduralBrief = {
  industryName: string;
  naics: string;
  archetypeLabel: string | null;
  workflows: string[];
  nextMoves: string[];
  notes: string[];
};

export type GenerateBriefInput = {
  naics: string;
  goal: string;
};

export function generateProceduralBrief(
  input: GenerateBriefInput
): ProceduralBrief | null {
  const { naics, goal } = input;
  const profile = getIndustryProfile(naics);

  if (!profile) {
    return null;
  }

  const workflows = profile.workflows.map((w) => w.label);

  const nextMoves: string[] = [
    "Clarify the exact outcome you want in this industry.",
    "Identify which core workflow(s) your goal touches.",
    "List required documentation and approvals for those workflows.",
    "Map out compliance or risk surfaces implied by your goal.",
    "Turn this into a concrete, step-by-step execution checklist.",
  ];

  const notes: string[] = [];
  if (goal.trim().length > 0) {
    notes.push(`User goal: ${goal.trim()}`);
  }
  if (!profile.archetype) {
    notes.push(
      "No archetype classification found; treat this as a custom workflow mapping."
    );
  }

  return {
    industryName: profile.industry.name,
    naics: profile.industry.naics,
    archetypeLabel: profile.archetype ? profile.archetype.label : null,
    workflows,
    nextMoves,
    notes,
  };
}
