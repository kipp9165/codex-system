"use client";

import React from "react";

type ProceduralBrief = {
  industryName: string;
  naics: string;
  archetypeLabel: string | null;
  workflows: string[];
  nextMoves: string[];
  notes: string[];
};

// Suppress unused-type lint warning — exported for consumers
export type { ProceduralBrief };

/** A single animated shimmer bar. */
function ShimmerBar({ width = "w-full", height = "h-3" }: { width?: string; height?: string }) {
  return <div className={`${width} ${height} rounded bg-slate-200 animate-pulse`} />;
}

/**
 * Skeleton loading placeholder that mirrors the layout of a rendered
 * ProceduralBrief results card.
 */
export function AutoBriefShimmer() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
      {/* Header — industry name + NAICS / archetype line */}
      <div className="space-y-2">
        <ShimmerBar width="w-2/3" height="h-5" />
        <ShimmerBar width="w-1/3" height="h-3" />
      </div>

      {/* Core Workflows */}
      <section className="space-y-2">
        <ShimmerBar width="w-1/4" height="h-3" />
        <div className="pl-4 space-y-2">
          <ShimmerBar width="w-full" />
          <ShimmerBar width="w-5/6" />
          <ShimmerBar width="w-4/6" />
        </div>
      </section>

      {/* Next Moves */}
      <section className="space-y-2">
        <ShimmerBar width="w-1/4" height="h-3" />
        <div className="pl-4 space-y-2">
          <ShimmerBar width="w-full" />
          <ShimmerBar width="w-5/6" />
          <ShimmerBar width="w-3/4" />
          <ShimmerBar width="w-4/6" />
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 space-y-2">
        <ShimmerBar width="w-1/5" height="h-3" />
        <div className="pl-4 space-y-2">
          <ShimmerBar width="w-full" />
          <ShimmerBar width="w-4/5" />
        </div>
      </section>
    </div>
  );
}
