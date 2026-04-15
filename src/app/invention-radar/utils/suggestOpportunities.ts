export interface Opportunity {
  title: string;
  description: string;
  category: "Patent" | "Market" | "Technical" | "Research";
}

export interface OpportunitiesResult {
  opportunities: Opportunity[];
}

export function suggestOpportunities(text: string): OpportunitiesResult {
  const opportunities: Opportunity[] = [];
  const lower = text.toLowerCase();

  if (/drug|medicine|pharmaceutical|treatment|therapy|patient/i.test(lower)) {
    opportunities.push({
      title: "Pharmaceutical Patent Filing",
      description:
        "Consider filing a composition-of-matter or method-of-treatment patent for broader protection.",
      category: "Patent",
    });
    opportunities.push({
      title: "Clinical / Regulatory Pathway",
      description:
        "Explore FDA / EMA approval pathways. Early engagement with regulatory bodies can accelerate time to market.",
      category: "Market",
    });
  }

  if (/software|algorithm|machine learning|ai|data/i.test(lower)) {
    opportunities.push({
      title: "Technical Implementation Patent",
      description:
        "Frame the claims around the specific technical implementation rather than the abstract idea to improve patentability.",
      category: "Patent",
    });
    opportunities.push({
      title: "SaaS / Licensing Model",
      description:
        "Software inventions are well-suited for SaaS licensing. Consider a tiered licensing model.",
      category: "Market",
    });
  }

  if (/material|alloy|composite|polymer|nano/i.test(lower)) {
    opportunities.push({
      title: "Materials Patent",
      description:
        "File a composition patent covering specific formulations, manufacturing processes, and downstream applications.",
      category: "Patent",
    });
  }

  if (/method|process|step|procedure/i.test(lower)) {
    opportunities.push({
      title: "Method Claims",
      description:
        "Protect the novel process steps with method claims — these can cover both direct and indirect infringement.",
      category: "Patent",
    });
  }

  opportunities.push({
    title: "Prior Art Search",
    description:
      "Conduct a professional patentability search (e.g., Google Patents, USPTO, Espacenet) to identify existing art and refine claims.",
    category: "Research",
  });

  opportunities.push({
    title: "Provisional Application",
    description:
      "File a provisional patent application to establish an early priority date while continuing to develop the invention.",
    category: "Patent",
  });

  if (/improve|enhanc|optimiz|better|faster|efficient/i.test(lower)) {
    opportunities.push({
      title: "Improvement / Continuation Patents",
      description:
        "Future improvements to the core invention may be protectable as continuation or continuation-in-part applications.",
      category: "Patent",
    });
  }

  return { opportunities };
}
