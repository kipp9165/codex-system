/**
 * Opportunities.tsx
 *
 * Renders the opportunity suggestions returned by suggestOpportunities():
 *   – patentOpportunities[]
 *   – marketOpportunities[]
 *   – technicalOpportunities[]
 *   – researchDirections[]
 *
 * Each group is shown in a collapsible section with titled cards.
 */

"use client";

import { useState } from "react";
import type { OpportunitiesResult, Opportunity } from "../utils/suggestOpportunities";

interface Props {
  data: OpportunitiesResult;
}

// ---------------------------------------------------------------------------
// Group configuration
// ---------------------------------------------------------------------------

interface GroupConfig {
  key: keyof OpportunitiesResult;
  title: string;
  icon: string;
  accent: string;
}

const GROUPS: GroupConfig[] = [
  {
    key: "patentOpportunities",
    title: "Patent Opportunities",
    icon: "⚖",
    accent: "border-indigo-300 bg-indigo-50",
  },
  {
    key: "marketOpportunities",
    title: "Market Opportunities",
    icon: "📈",
    accent: "border-emerald-300 bg-emerald-50",
  },
  {
    key: "technicalOpportunities",
    title: "Technical Opportunities",
    icon: "🔧",
    accent: "border-amber-300 bg-amber-50",
  },
  {
    key: "researchDirections",
    title: "Research Directions",
    icon: "🔬",
    accent: "border-purple-300 bg-purple-50",
  },
];

// ---------------------------------------------------------------------------
// Single opportunity card
// ---------------------------------------------------------------------------

function OpportunityCard({ item, accent }: { item: Opportunity; accent: string }) {
  return (
    <div className={`rounded-lg border p-4 ${accent} space-y-2`}>
      <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
      <div className="rounded bg-white/60 border border-white/80 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Suggested Next Step
        </span>
        <p className="mt-0.5 text-sm text-slate-700">{item.suggestedNextStep}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible group section
// ---------------------------------------------------------------------------

function GroupSection({
  config,
  items,
}: {
  config: GroupConfig;
  items: Opportunity[];
}) {
  const [open, setOpen] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between bg-white px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{config.icon}</span>
          <span className="font-semibold text-slate-800 text-sm">{config.title}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            {items.length}
          </span>
        </div>
        <span className="text-slate-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
          {items.map((item, i) => (
            <OpportunityCard key={i} item={item} accent={config.accent} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Opportunities({ data }: Props) {
  const total = GROUPS.reduce((sum, g) => sum + data[g.key].length, 0);

  if (total === 0) {
    return (
      <p className="text-sm text-slate-400 italic">
        No opportunities generated. Provide more detailed invention text.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {GROUPS.map((config) => (
        <GroupSection
          key={config.key}
          config={config}
          items={data[config.key]}
        />
      ))}
    </div>
  );
}
