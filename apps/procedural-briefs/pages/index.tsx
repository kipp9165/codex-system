import { useState } from "react";
import { getIndustryProfile } from "../../../codex/cii/engine";

export default function ProceduralBriefsPage() {
  const [naics, setNaics] = useState("621");
  const [goal, setGoal] = useState("");
  const profile = getIndustryProfile(naics);

  return (
    <></>
  );
}
