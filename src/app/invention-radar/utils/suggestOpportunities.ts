/**
 * suggestOpportunities.ts
 *
 * Generates structured opportunity suggestions from invention text across
 * four dimensions:
 *
 *   – patentOpportunities[]    : IP filing and protection strategies
 *   – marketOpportunities[]    : commercialisation and go-to-market angles
 *   – technicalOpportunities[] : engineering and R&D directions
 *   – researchDirections[]     : academic / exploratory research paths
 *
 * Each item has:
 *   { title, description, suggestedNextStep }
 *
 * No external APIs – pure TypeScript keyword-driven generation.
 */

export interface Opportunity {
  title: string;
  description: string;
  suggestedNextStep: string;
}

export interface OpportunitiesResult {
  patentOpportunities: Opportunity[];
  marketOpportunities: Opportunity[];
  technicalOpportunities: Opportunity[];
  researchDirections: Opportunity[];
}

// ---------------------------------------------------------------------------
// Domain detection helpers (mirrors summarize.ts but self-contained)
// ---------------------------------------------------------------------------

interface DomainSignal {
  domain: string;
  keywords: string[];
}

const DOMAIN_SIGNALS: DomainSignal[] = [
  { domain: "AI/ML", keywords: ["neural network", "machine learning", "deep learning", "ai model", "classifier", "training data"] },
  { domain: "Biotech/Medical", keywords: ["gene", "protein", "cell", "therapy", "drug", "diagnostic", "biosensor", "medical device"] },
  { domain: "Clean Energy", keywords: ["solar", "battery", "renewable", "fuel cell", "carbon", "energy storage", "photovoltaic"] },
  { domain: "Semiconductor", keywords: ["semiconductor", "transistor", "circuit", "chip", "integrated circuit", "fpga"] },
  { domain: "Robotics", keywords: ["robot", "actuator", "autonomous", "motion control", "gripper"] },
  { domain: "Communications", keywords: ["wireless", "5g", "antenna", "protocol", "network", "bandwidth"] },
  { domain: "Software", keywords: ["software", "algorithm", "database", "api", "cloud", "microservice"] },
  { domain: "Materials", keywords: ["alloy", "composite", "polymer", "nanoparticle", "coating", "graphene"] },
  { domain: "Chemistry", keywords: ["catalyst", "reaction", "synthesis", "compound", "electrolyte", "reagent"] },
  { domain: "Mechanical", keywords: ["mechanism", "gear", "valve", "hydraulic", "pneumatic", "bearing"] },
];

function detectDomain(text: string): string {
  const lower = text.toLowerCase();
  let best = "General Technology";
  let bestCount = 0;
  for (const { domain, keywords } of DOMAIN_SIGNALS) {
    const count = keywords.filter((kw) => lower.includes(kw)).length;
    if (count > bestCount) {
      bestCount = count;
      best = domain;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Opportunity template library
// ---------------------------------------------------------------------------

/** Generic opportunities always included (domain-agnostic). */
const BASE_PATENT_OPPORTUNITIES: Opportunity[] = [
  {
    title: "File a Provisional Patent Application",
    description:
      "Secure an early filing date by submitting a provisional application. This grants 12 months to refine claims and gather evidence before the full application.",
    suggestedNextStep:
      "Draft a provisional application with detailed claims, drawings, and best-mode description. Engage a patent attorney to review prior art.",
  },
  {
    title: "Claim Dependency Hierarchy",
    description:
      "Structure claims in a hierarchy (independent → dependent) to cover both the broadest scope and specific embodiments, maximising protection while hedging against invalidity.",
    suggestedNextStep:
      "Work with a patent attorney to draft at least 3 independent claims and 5–10 dependent claims covering key embodiments.",
  },
  {
    title: "International PCT Filing",
    description:
      "A PCT application opens the door to patent protection in 150+ countries via a single filing, deferring national-phase costs by up to 30 months.",
    suggestedNextStep:
      "Evaluate target markets for commercialisation, then file a PCT within 12 months of the priority date.",
  },
];

const BASE_MARKET_OPPORTUNITIES: Opportunity[] = [
  {
    title: "Licensing to Industry Leaders",
    description:
      "Existing market players may lack the specific capabilities this invention provides. A licensing deal can generate revenue without the need to build a product organisation.",
    suggestedNextStep:
      "Identify 5–10 potential licensees, prepare a non-confidential one-pager, and initiate introductory conversations.",
  },
  {
    title: "Startup Spin-out",
    description:
      "If the invention solves a significant unmet need, founding a startup could capture substantially more value than licensing.",
    suggestedNextStep:
      "Conduct a market-size analysis, validate the core value proposition with 10 potential customers, and evaluate funding options.",
  },
  {
    title: "Strategic Partnership / Joint Development",
    description:
      "Partner with a larger organisation that controls distribution, manufacturing, or regulatory pathways to accelerate market entry.",
    suggestedNextStep:
      "Map complementary organisations and structure a joint-development agreement (JDA) with clear IP ownership terms.",
  },
];

const BASE_TECHNICAL_OPPORTUNITIES: Opportunity[] = [
  {
    title: "Prototype & Performance Benchmarking",
    description:
      "Building a working prototype and benchmarking it against existing solutions provides concrete evidence of improvement, strengthening both patent applications and investor pitches.",
    suggestedNextStep:
      "Identify the minimum viable prototype scope, source components, and define key performance indicators (KPIs).",
  },
  {
    title: "Modular Architecture for Scaling",
    description:
      "Designing the system as modular, composable components allows rapid iteration, integration with third-party systems, and cost-efficient scaling.",
    suggestedNextStep:
      "Define interface specifications for each module and document the API contracts before starting implementation.",
  },
  {
    title: "Failure-Mode Analysis (FMEA)",
    description:
      "A structured FMEA identifies the top risk scenarios early, guiding safety improvements and regulatory compliance work.",
    suggestedNextStep:
      "Assemble a cross-functional team to complete an FMEA worksheet for the highest-risk subsystems.",
  },
];

const BASE_RESEARCH_DIRECTIONS: Opportunity[] = [
  {
    title: "Systematic Literature Review",
    description:
      "A rigorous literature review establishes the state-of-the-art, locates gaps, and provides the comparative context needed for a strong patent non-obviousness argument.",
    suggestedNextStep:
      "Search databases (Google Scholar, IEEE Xplore, PubMed, USPTO) using the invention's core keywords and publish a summary of findings.",
  },
  {
    title: "Open-Access Publication",
    description:
      "Publishing technical results in an open-access journal or arXiv establishes prior art for defensive publication, builds credibility, and attracts collaborators.",
    suggestedNextStep:
      "Draft a technical paper focusing on the novel mechanism and results. Submit to a relevant peer-reviewed venue after filing the patent application.",
  },
  {
    title: "Experimental Validation of Core Claims",
    description:
      "Rigorous experimental validation transforms speculative claims into evidence-backed assertions, significantly increasing patent grant likelihood.",
    suggestedNextStep:
      "Design a controlled experiment targeting the core claim, define statistical significance thresholds, and document all results.",
  },
];

// ---------------------------------------------------------------------------
// Domain-specific opportunity enrichment
// ---------------------------------------------------------------------------

const DOMAIN_PATENT_EXTRAS: Record<string, Opportunity[]> = {
  "AI/ML": [
    {
      title: "Patent the Training Pipeline",
      description:
        "Novel data preprocessing, labelling schemes, or training algorithms can be independently patentable even if the model architecture is not.",
      suggestedNextStep:
        "Isolate the novel elements of the training pipeline and draft method claims covering data transformation steps.",
    },
  ],
  "Biotech/Medical": [
    {
      title: "Composition-of-Matter Claims",
      description:
        "For novel biological or chemical entities, composition-of-matter claims provide the broadest patent protection.",
      suggestedNextStep:
        "Characterise the novel compound/entity with structural data and file composition claims alongside method claims.",
    },
  ],
  "Clean Energy": [
    {
      title: "Green Patent Fast-Track",
      description:
        "Many patent offices (USPTO, EPO) offer accelerated examination for clean-energy inventions, reducing grant timelines by 12–18 months.",
      suggestedNextStep:
        "Check eligibility for the USPTO Green Technology Pilot or EPO PACE programme and file a petition for acceleration.",
    },
  ],
};

const DOMAIN_MARKET_EXTRAS: Record<string, Opportunity[]> = {
  "AI/ML": [
    {
      title: "AI-as-a-Service (APIaaS) Model",
      description:
        "Wrap the core AI capability in an API and offer it on a usage-based pricing model to reach developers and enterprises quickly.",
      suggestedNextStep:
        "Build a REST API wrapper, create documentation, and soft-launch on a developer marketplace.",
    },
  ],
  "Biotech/Medical": [
    {
      title: "Regulatory Pathway Planning (FDA/CE)",
      description:
        "Early engagement with regulatory bodies de-risks the commercialisation timeline for medical inventions.",
      suggestedNextStep:
        "Engage a regulatory consultant to define the classification and submission pathway (510(k), De Novo, PMA).",
    },
  ],
  "Clean Energy": [
    {
      title: "Government Grant Funding",
      description:
        "Clean energy inventions are eligible for grants from ARPA-E, Innovate UK, EU Horizon, and national climate funds.",
      suggestedNextStep:
        "Identify 3–5 active grant programmes aligned to the technology and prepare a funding application.",
    },
  ],
};

const DOMAIN_TECHNICAL_EXTRAS: Record<string, Opportunity[]> = {
  "AI/ML": [
    {
      title: "Explainability & Interpretability Layer",
      description:
        "Adding an explainability module increases regulatory acceptance, user trust, and academic impact.",
      suggestedNextStep:
        "Integrate SHAP or LIME attributions and create a visualisation dashboard for model decisions.",
    },
  ],
  "Semiconductor": [
    {
      title: "SPICE Simulation & Layout Verification",
      description:
        "Early-stage SPICE simulations and DRC checks prevent costly respins and validate performance claims.",
      suggestedNextStep:
        "Set up a simulation environment, model the critical path, and document corner-case results.",
    },
  ],
  "Materials": [
    {
      title: "Computational Materials Modelling (DFT/MD)",
      description:
        "Ab-initio simulations can predict material properties before expensive synthesis, shortening the R&D cycle.",
      suggestedNextStep:
        "Identify a suitable DFT code (VASP, Quantum ESPRESSO) and model the key structural and electronic properties.",
    },
  ],
};

const DOMAIN_RESEARCH_EXTRAS: Record<string, Opportunity[]> = {
  "AI/ML": [
    {
      title: "Benchmark on Standard Datasets",
      description:
        "Demonstrating superior performance on well-known benchmarks (ImageNet, GLUE, etc.) provides objective, comparable evidence of novelty.",
      suggestedNextStep:
        "Select 2–3 relevant benchmarks, run experiments, and document results with statistical confidence intervals.",
    },
  ],
  "Biotech/Medical": [
    {
      title: "Preclinical Animal Model Study",
      description:
        "Preclinical studies provide the safety and efficacy evidence needed to progress to clinical trials and satisfy enablement requirements.",
      suggestedNextStep:
        "Engage a CRO to design and run an appropriate animal model study under IACUC-approved protocols.",
    },
  ],
  "Chemistry": [
    {
      title: "Scale-Up & Process Chemistry Study",
      description:
        "Demonstrating scalability beyond bench scale is critical for industrial relevance and commercial viability.",
      suggestedNextStep:
        "Run a kilogram-scale synthesis, document yield and purity, and identify cost-reduction opportunities.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Suggest patent, market, technical, and research opportunities based on
 * raw invention text.
 */
export function suggestOpportunities(text: string): OpportunitiesResult {
  const domain = detectDomain(text ?? "");

  const patentOpportunities: Opportunity[] = [
    ...BASE_PATENT_OPPORTUNITIES,
    ...(DOMAIN_PATENT_EXTRAS[domain] ?? []),
  ];

  const marketOpportunities: Opportunity[] = [
    ...BASE_MARKET_OPPORTUNITIES,
    ...(DOMAIN_MARKET_EXTRAS[domain] ?? []),
  ];

  const technicalOpportunities: Opportunity[] = [
    ...BASE_TECHNICAL_OPPORTUNITIES,
    ...(DOMAIN_TECHNICAL_EXTRAS[domain] ?? []),
  ];

  const researchDirections: Opportunity[] = [
    ...BASE_RESEARCH_DIRECTIONS,
    ...(DOMAIN_RESEARCH_EXTRAS[domain] ?? []),
  ];

  return {
    patentOpportunities,
    marketOpportunities,
    technicalOpportunities,
    researchDirections,
  };
}
