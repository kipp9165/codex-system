import data from "./cupg-example-healthcare.json";

export type Industry = {
  naics: string;
  name: string;
  cluster: string;
  archetypeId: string;
};

export type Archetype = {
  id: string;
  label: string;
  description?: string;
};

export type Workflow = {
  id: string;
  label: string;
  archetypeId: string;
  steps: string[];
};

type Graph = {
  industries: Industry[];
  archetypes: Archetype[];
  workflows: Workflow[];
};

const graph = data as Graph;

export function getIndustryProfile(naics: string) {
  const industry = graph.industries.find(i => i.naics === naics);
  if (!industry) return null;

  const archetype =
    graph.archetypes.find(a => a.id === industry.archetypeId) || null;
  const workflows = graph.workflows.filter(
    w => w.archetypeId === industry.archetypeId
  );

  return { industry, archetype, workflows };
}

export function getSimilarIndustries(naics: string) {
  const base = graph.industries.find(i => i.naics === naics);
  if (!base) return [];
  return graph.industries.filter(
    i => i.archetypeId === base.archetypeId && i.naics !== naics
  );
}
