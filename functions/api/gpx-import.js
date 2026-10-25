// Count imports, never receive the GPX or identify the visitor.
function reply(status) {
  return new Response(null, { status, headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    ...(status === 405 ? { Allow: 'POST' } : {}),
  } });
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return reply(405);
  if (request.headers.get('Origin') !== new URL(request.url).origin) return reply(403);
  // The client sends an empty POST. Reject all supplied data without reading it.
  // Cloudflare may represent an empty POST as an empty stream rather than null.
  if (request.body !== null) {
    const reader = request.body.getReader();
    try {
      const { done } = await reader.read();
      if (!done) {
        await reader.cancel().catch(() => {});
        return reply(400);
      }
    } catch { return reply(400); }
  }
  if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return reply(204);
  if (!env.USAGE) return reply(503);
  const day = new Date().toISOString().slice(0, 10);
  try {
    // Separate entries avoid lost updates from concurrent KV read/modify/write.
    // The random ID identifies only this event; it is never sent to the browser.
    await env.USAGE.put(`gpx-import:${day}:${crypto.randomUUID()}`, '1', {
      expirationTtl: 90 * 86400,
    });
    return reply(204);
  } catch { return reply(503); }
}
