"use client";

import React from "react";
import { mapInventionToIndustry } from "../lib/industryMapping";

type IndustryContextPanelProps = {
  naics: string | null;
};

const PANEL_HEADING = "Industry context";

export function IndustryContextPanel({ naics }: IndustryContextPanelProps) {
  if (!naics) {
    return (
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "1rem",
          marginTop: "1rem",
          background: "#f9fafb",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{PANEL_HEADING}</h3>
        <p style={{ margin: 0 }}>Enter a NAICS code to load industry context.</p>
      </section>
    );
  }

  const context = mapInventionToIndustry(naics);

  if (!context) {
    return (
      <section
        style={{
          border: "1px solid #fee2e2",
          borderRadius: 8,
          padding: "1rem",
          marginTop: "1rem",
          background: "#fef2f2",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{PANEL_HEADING}</h3>
        <p style={{ margin: 0 }}>No industry profile found for NAICS {naics}.</p>
      </section>
    );
  }

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "1rem",
        marginTop: "1rem",
        background: "#f9fafb",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{PANEL_HEADING}</h3>
      <p style={{ margin: "0 0 0.5rem" }}>
        <strong>{context.name}</strong> ({context.naics})
      </p>
      <p style={{ margin: 0 }}>
        Archetype:{" "}
        {context.archetypeLabel ? context.archetypeLabel : "Not yet classified"}
      </p>
    </section>
  );
}
