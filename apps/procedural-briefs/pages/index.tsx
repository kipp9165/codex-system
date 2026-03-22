import { FormEvent, useState } from "react";

type ProceduralBrief = {
  industryName: string;
  naics: string;
  archetypeLabel: string | null;
  workflows: string[];
  nextMoves: string[];
  notes: string[];
};

export default function ProceduralBriefsPage() {
  const [naics, setNaics] = useState("621");
  const [goal, setGoal] = useState("");
  const [brief, setBrief] = useState<ProceduralBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBrief(null);

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naics, goal }),
      });

      const data = (await res.json()) as
        | { ok: true; brief: ProceduralBrief }
        | { ok: false; error: string };

      if (!data.ok) {
        setError(data.error || "Failed to generate brief");
      } else {
        setBrief(data.brief);
      }
    } catch {
      setError("Unexpected error while generating brief");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-xl font-bold text-slate-900">
            📋 Procedural Briefs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate a structured workflow brief for any NAICS industry code
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-4"
        >
          <div>
            <label
              htmlFor="naics"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              NAICS Code
            </label>
            <input
              id="naics"
              type="text"
              value={naics}
              onChange={(e) => setNaics(e.target.value)}
              placeholder="e.g. 621"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="goal"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              Goal
            </label>
            <textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe what you want to accomplish in this industry…"
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating…" : "Generate Brief →"}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {brief && (
          <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {brief.industryName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                NAICS {brief.naics}
                {brief.archetypeLabel
                  ? ` · ${brief.archetypeLabel}`
                  : " · No archetype"}
              </p>
            </div>

            {brief.workflows.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Core Workflows
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                  {brief.workflows.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Next Moves
              </h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
                {brief.nextMoves.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ol>
            </section>

            {brief.notes.length > 0 && (
              <section className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-amber-800 mb-1">
                  Notes
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
                  {brief.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
