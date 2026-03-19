"use client";

import React, { useState } from "react";
import TextInput from "./components/TextInput";
import AnalyzeButton from "./components/AnalyzeButton";
import StructureMap from "./components/StructureMap";
import Summary from "./components/Summary";
import RiskFlags from "./components/RiskFlags";
import NoveltyHints from "./components/NoveltyHints";
import Opportunities from "./components/Opportunities";
import FeedbackPanel from "./components/FeedbackPanel";
import { analyzeText, AnalysisResult } from "./utils/analyzeText";

export default function InventionRadarPage() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleAnalyze() {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    setError(null);
    setLoading(true);
    // Simulate brief processing delay for UX
    setTimeout(() => {
      try {
        const result = analyzeText(inputText);
        setResults(result);
      } catch (err) {
        console.error("Analysis error:", err);
        setError("An error occurred during analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  function handleReset() {
    setInputText("");
    setResults(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛰️</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Invention Radar</h1>
              <p className="text-xs text-gray-500">v0.1 — Frontend MVP</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Paste your invention description or patent draft below and get an instant AI-style
            analysis of structure, novelty, risks, and opportunities.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Input Panel */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Input
          </h2>
          <TextInput
            value={inputText}
            onChange={setInputText}
            placeholder="e.g. A novel method for synthesizing biodegradable polymers using enzymatic catalysis at ambient temperature, comprising the steps of..."
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <AnalyzeButton
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            loading={loading}
          />
        </section>

        {/* Results */}
        {results && (
          <section>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Analysis Results
            </h2>

            <div className="grid gap-6 lg:grid-cols-2">
              <StructureMap data={results.structure} />
              <Summary data={results.summary} />
              <RiskFlags data={results.risks} />
              <NoveltyHints data={results.novelty} />
              <div className="lg:col-span-2">
                <Opportunities data={results.opportunities} />
              </div>
              <div className="lg:col-span-2">
                <FeedbackPanel onReset={handleReset} />
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!results && !loading && (
          <div className="mt-4 rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <p className="text-3xl mb-3">🛰️</p>
            <p className="text-sm font-medium text-gray-500">
              Enter your invention text above and click <strong>Analyze</strong> to get started.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              No backend required — all analysis runs in the browser.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
