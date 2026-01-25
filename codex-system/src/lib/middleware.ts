import { validateSession } from "./auth";
import { logEvent } from "./activityLog";

export async function withCodex(env, request, organ, action, handler) {
  const session = await validateSession(env, request);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const operator = {
    id: session.stripeCustomerId,
    name: session.name,
    email: session.email,
  };

  const response = await handler({ env, request, operator });

  await logEvent(env, {
    operatorId: operator.id,
    organ,
    action,
    entityId: null,
    metadata: { path: new URL(request.url).pathname },
  });

  return response;
}
