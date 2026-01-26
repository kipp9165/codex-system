export async function onRequest(context) {
  const initialized = await context.env.CODEX_SYSTEM.get("system:initialized");

  return new Response(JSON.stringify({
    system: "codex",
    initialized,
    timestamp: Date.now()
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

