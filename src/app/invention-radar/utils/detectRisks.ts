export interface RiskFlag {
  level: "high" | "medium" | "low";
  category: string;
  description: string;
}

export interface RiskResult {
  flags: RiskFlag[];
  overallRisk: "high" | "medium" | "low";
}

export function detectRisks(text: string): RiskResult {
  const flags: RiskFlag[] = [];
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  if (wordCount < 50) {
    flags.push({
      level: "high",
      category: "Insufficient Disclosure",
      description:
        "The text is very short. A patent application requires adequate written description of the invention.",
    });
  }

  if (!/claim|wherein|comprising|having|method|apparatus/i.test(lower)) {
    flags.push({
      level: "medium",
      category: "Missing Claims Language",
      description:
        "No patent claim language detected. Formal claims are essential for patent protection.",
    });
  }

  if (/obvious|simple|basic|trivial|well.?known|common/i.test(lower)) {
    flags.push({
      level: "medium",
      category: "Obviousness Risk",
      description:
        "Language suggesting the invention may be considered obvious over prior art was detected.",
    });
  }

  if (/abstract idea|mental process|math|algorithm|natural law|natural phenomenon/i.test(lower)) {
    flags.push({
      level: "high",
      category: "Patent Eligibility (§101)",
      description:
        "References to abstract ideas, mathematical concepts, or natural phenomena detected — these may face eligibility challenges.",
    });
  }

  if (!/problem|challenge|issue|limitation/i.test(lower)) {
    flags.push({
      level: "low",
      category: "No Problem Statement",
      description:
        "No clear problem statement found. Articulating the technical problem strengthens the disclosure.",
    });
  }

  if (/prior art|known in the art|previously disclosed/i.test(lower)) {
    flags.push({
      level: "medium",
      category: "Prior Art Reference",
      description:
        "References to prior art were found. Ensure claims are differentiated from the prior art.",
    });
  }

  const highCount = flags.filter((f) => f.level === "high").length;
  const overallRisk: "high" | "medium" | "low" =
    highCount >= 1 ? "high" : flags.length >= 2 ? "medium" : "low";

  return { flags, overallRisk };
}
