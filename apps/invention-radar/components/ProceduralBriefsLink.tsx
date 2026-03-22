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
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : "border-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
      title={
        disabled
          ? "Enter a NAICS code to generate a procedural brief"
          : "Open Codex briefs for this industry and goal"
      }
    >
      Generate Procedural Brief →
    </button>
  );
}
