export async function validateSession(env, request) {
  return {
    stripeCustomerId: "cus_demo",
    name: "Demo Operator",
    email: "demo@example.com",
  };
}
