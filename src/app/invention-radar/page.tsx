/**
 * src/app/invention-radar/page.tsx
 *
 * Invention Radar v0.1
 *
 * A single-page analysis tool that takes raw invention text and runs
 * five independent analyses:
 *   1. Structure detection  → StructureMap
 *   2. Summarisation        → Summary
 *   3. Risk assessment      → RiskFlags
 *   4. Novelty scoring      → NoveltyHints
 *   5. Opportunity mapping  → Opportunities
 *
 * Everything runs client-side – no backend, no external APIs.
 */

"use client";

import { useState, useCallback } from "react";

import { detectStructure } from "./utils/detectStructure";
import { summarize } from "./utils/summarize";
import { detectRisks } from "./utils/detectRisks";
import { detectNovelty } from "./utils/detectNovelty";
import { suggestOpportunities } from "./utils/suggestOpportunities";

import StructureMap from "./components/StructureMap";
import Summary from "./components/Summary";
import RiskFlags from "./components/RiskFlags";
import NoveltyHints from "./components/NoveltyHints";
import Opportunities from "./components/Opportunities";

import type { StructureResult } from "./utils/detectStructure";
import type { SummaryResult } from "./utils/summarize";
import type { RiskResult } from "./utils/detectRisks";
import type { NoveltyResult } from "./utils/detectNovelty";
import type { OpportunitiesResult } from "./utils/suggestOpportunities";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnalysisResults {
  structure: StructureResult;
  summary: SummaryResult;
  risks: RiskResult;
  novelty: NoveltyResult;
  opportunities: OpportunitiesResult;
}

// ---------------------------------------------------------------------------
// Tab configuration
// ---------------------------------------------------------------------------

type TabKey = "summary" | "structure" | "risks" | "novelty" | "opportunities";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { key: "summary", label: "Summary", icon: "📝" },
  { key: "structure", label: "Structure", icon: "🗂" },
  { key: "risks", label: "Risks", icon: "⚠️" },
  { key: "novelty", label: "Novelty", icon: "💡" },
  { key: "opportunities", label: "Opportunities", icon: "🚀" },
];

// ---------------------------------------------------------------------------
// Sample placeholder text
// ---------------------------------------------------------------------------

const PLACEHOLDER = `Describe your invention here...

Example:
The present invention addresses the problem of excessive energy consumption in wireless sensor networks. Existing methods rely on continuous polling, which drains battery life within days. We propose a novel adaptive duty-cycling mechanism that combines deep-sleep hardware modes with a lightweight machine-learning classifier running on-device. The classifier predicts sensor event probability using historical patterns, enabling the node to remain dormant up to 95% of the time. Tests show a 10× improvement in battery life compared to conventional approaches. The mechanism comprises three components: a feature extractor, a decision module, and a wake-up controller, all implemented in under 4 KB of flash memory.`;

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function InventionRadarPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [analysing, setAnalysing] = useState(false);

  const runAnalysis = useCallback((text: string) => {
    setAnalysing(true);

    // Use a microtask so the "Analysing…" state actually renders
    setTimeout(() => {
      const structure = detectStructure(text);
      const summary = summarize(text);
      const risks = detectRisks(text);
      const novelty = detectNovelty(text);
      const opportunities = suggestOpportunities(text);

      setResults({ structure, summary, risks, novelty, opportunities });
      setActiveTab("summary");
      setAnalysing(false);
    }, 0);
  }, []);

  const handleAnalyze = (overrideText?: string) => {
    const text = overrideText ?? input;
    if (!text.trim()) return;
    runAnalysis(text);
  };

  const handleReset = () => {
    setInput("");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              🔭 Invention Radar
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                v0.1
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste your invention description · zero servers · pure TypeScript analysis
            </p>
          </div>
          {results && (
            <button
              onClick={handleReset}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              ← New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* ── Input area ──────────────────────────────────────────────── */}
        {!results && (
          <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <label
              htmlFor="invention-text"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Invention Description
            </label>

            {/* Example Inventions Panel */}
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                {
                  label: "Biodegradable Polymer Method",
                  text: "A novel method for synthesizing biodegradable polymers using enzymatic catalysis at ambient temperature, comprising the steps of...",
                },
                {
                  label: "Wildlife Collision Prevention",
                  text: "A real-time wildlife detection and collision-prevention system using thermal imaging, edge AI, and predictive path modeling to reduce vehicle-animal impacts.",
                },
                {
                  label: "Wearable Health Sensor Patch",
                  text: "A low-power wearable sensor patch that continuously monitors hydration, glucose, and electrolyte levels using microfluidic channels and flexible electronics.",
                },
              ].map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(ex.text);
                    setTimeout(() => handleAnalyze(ex.text), 50);
                  }}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <textarea
              id="invention-text"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[220px] resize-y font-mono leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {input.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={() => handleAnalyze()}
                disabled={!input.trim() || analysing}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {analysing ? "Analysing…" : "Analyse →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────── */}
        {results && (
          <div className="space-y-4">
            {/* Editable text snippet */}
            <details className="rounded-lg bg-white border border-slate-200 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-600 select-none">
                📄 View / Edit Input Text
              </summary>
              <textarea
                className="mt-3 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 font-mono leading-relaxed min-h-[120px] resize-y focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                onClick={() => handleAnalyze()}
                className="mt-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Re-analyse →
              </button>
            </details>

            {/* Tab bar */}
            <div className="flex overflow-x-auto gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-max rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              {activeTab === "summary" && <Summary data={results.summary} />}
              {activeTab === "structure" && <StructureMap data={results.structure} />}
              {activeTab === "risks" && <RiskFlags data={results.risks} />}
              {activeTab === "novelty" && <NoveltyHints data={results.novelty} />}
              {activeTab === "opportunities" && (
                <Opportunities data={results.opportunities} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
