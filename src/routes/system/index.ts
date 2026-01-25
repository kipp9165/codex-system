import { withCodex } from "../../../lib/middleware";
import { codexAI } from "../../../lib/ai";

export const onRequestGet = async ({ env, request }) => {
  return withCodex(env, request, "system", "view", async ({ operator }) => {
    const aiSummary = await codexAI(env, "Summarize the Codex system root.");

    return new Response(
      `<html><body>
        <h1>Codex System Root</h1>
        <p>Operator: ${operator.name}</p>
        <h2>AI Summary</h2>
        <pre>${aiSummary}</pre>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  });
};
