import { detectStructure, StructureResult } from "./detectStructure";
import { summarize, SummaryResult } from "./summarize";
import { detectRisks, RiskResult } from "./detectRisks";
import { detectNovelty, NoveltyResult } from "./detectNovelty";
import { suggestOpportunities, OpportunitiesResult } from "./suggestOpportunities";

export interface AnalysisResult {
  structure: StructureResult;
  summary: SummaryResult;
  risks: RiskResult;
  novelty: NoveltyResult;
  opportunities: OpportunitiesResult;
}

export function analyzeText(text: string): AnalysisResult {
  return {
    structure: detectStructure(text),
    summary: summarize(text),
    risks: detectRisks(text),
    novelty: detectNovelty(text),
    opportunities: suggestOpportunities(text),
  };
}
