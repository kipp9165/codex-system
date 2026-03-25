import type { NextApiRequest, NextApiResponse } from "next";
import {
  generateProceduralBrief,
  type GenerateBriefInput,
  type ProceduralBrief,
} from "../../../../codex/cii/generateProceduralBrief";

type BriefResponse =
  | { ok: true; brief: ProceduralBrief }
  | { ok: false; error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BriefResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body as Partial<GenerateBriefInput>;

    if (!body.naics) {
      return res
        .status(400)
        .json({ ok: false, error: "naics is required" });
    }

    const brief = generateProceduralBrief({
      naics: String(body.naics),
      goal: body.goal ? String(body.goal) : "",
    });

    if (!brief) {
      return res
        .status(404)
        .json({ ok: false, error: "No industry profile found for NAICS" });
    }

    return res.status(200).json({ ok: true, brief });
  } catch {
    return res
      .status(500)
      .json({ ok: false, error: "Failed to generate procedural brief" });
  }
}
