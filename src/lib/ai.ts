export async function codexAI(env, prompt) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are Codex." },
          { role: "user", content: prompt },
        ],
      }),
    }
  );

  const json = await res.json();
  return json.result.response;
}
