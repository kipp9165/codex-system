"use client";

import React from "react";

type ProceduralBriefsLinkProps = {
  naics: string | null;
  goal: string | null;
};

export function ProceduralBriefsLink({ naics, goal }: ProceduralBriefsLinkProps) {
  const disabled = !naics;

  function handleClick() {
    if (!naics) return;

    const params = new URLSearchParams();
    params.set("naics", naics);
    if (goal && goal.trim().length > 0) {
      params.set("goal", goal.trim());
    }

    const url = `/procedural-briefs?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      📋 Open Procedural Brief →
    </button>
  );
}
