/**
 * Checks the Authorization: Bearer <token> header against the
 * ORDERS_API_KEY Cloudflare secret.
 *
 * Returns a 401 Response on failure, or null when the request is authorised.
 * Use with early return:
 *
 *   const deny = requireApiKey(request, env);
 *   if (deny) return deny;
 */
export function requireApiKey(
  request: Request,
  env: CloudflareEnv,
): Response | null {
  const apiKey = env.ORDERS_API_KEY;
  if (!apiKey) {
    // ORDERS_API_KEY secret is not configured on this Worker
    return new Response(
      JSON.stringify({ error: "API key not configured on server." }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || token !== apiKey) {
    return new Response(
      JSON.stringify({ error: "Unauthorized." }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": 'Bearer realm="ThermalBridge Orders API"',
        },
      },
    );
  }

  return null; // authorised
}
