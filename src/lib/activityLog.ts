export async function logEvent(env, event) {
  await fetch(env.BASEROW_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Token ${env.BASEROW_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      operatorId: event.operatorId,
      organ: event.organ,
      action: event.action,
      entityId: event.entityId,
      metadata: JSON.stringify(event.metadata),
    }),
  });
}
