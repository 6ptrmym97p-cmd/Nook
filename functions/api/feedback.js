// Cloudflare Pages Function: stores visitor feedback in the FEEDBACK KV namespace.
const KINDS = ["tip", "klacht", "bug"];
const MAX_BODY_BYTES = 8000;
const MAX_MESSAGE = 2000;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 3600;

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Referrer-Policy": "no-referrer",
      ...headers,
    },
  });
}

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function notifyByEmail(env, key, record, metadata) {
  let notification;
  try {
    const labels = { tip: "Tip", klacht: "Klacht", bug: "Bug" };
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: env.FEEDBACK_EMAIL_FROM || "Nook feedback <onboarding@resend.dev>",
        to: [env.FEEDBACK_EMAIL_TO],
        subject: `[Nook] Nieuwe feedback: ${labels[record.kind]}`,
        ...(record.email ? { reply_to: record.email } : {}),
        text: [
          "Nieuwe feedback voor Nook",
          `Type: ${labels[record.kind]}`,
          `Ontvangen: ${record.createdAt}`,
          "",
          record.message,
          "",
          `E-mail bezoeker: ${record.email || "Niet opgegeven"}`,
          `Pagina: ${record.page}`,
          `Kaartpositie: ${record.mapView}`,
          `Taal: ${record.language}`,
          `Land: ${record.country}`,
          `Appversie: ${record.appVersion}`,
          `Scherm: ${record.viewport}`,
          `Browser: ${record.userAgent}`,
        ].join("\n"),
      }),
    });
    if (!response.ok) throw new Error("Email service rejected the request.");
    const result = await response.json();
    if (typeof result?.id !== "string" || !result.id) throw new Error("Email service did not confirm receipt.");
    notification = { status: "sent", sentAt: new Date().toISOString(), id: result.id };
  } catch {
    // The feedback is already saved. Never ask the visitor to submit it again.
    notification = { status: "failed", attemptedAt: new Date().toISOString() };
    console.error("Feedback email notification failed; the message remains in KV.");
  }
  await env.FEEDBACK.put(key, JSON.stringify({ ...record, notification }), { metadata });
}

export async function onRequest(handlerContext) {
  const { request, env } = handlerContext;
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, { Allow: "POST" });
  if (!env.FEEDBACK) return json({ error: "Feedback is nog niet ingesteld." }, 503);

  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "Ongeldige herkomst." }, 403);
  if ((request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase() !== "application/json") return json({ error: "Verkeerd formaat." }, 415);

  if (Number(request.headers.get("Content-Length")) > MAX_BODY_BYTES) return json({ error: "Bericht is te lang." }, 413);
  // Bound memory before parsing, including chunked bodies without Content-Length.
  const reader = request.body?.getReader();
  const chunks = [];
  let bytes = 0;
  if (reader) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BODY_BYTES) {
          await reader.cancel().catch(() => {});
          return json({ error: "Bericht is te lang." }, 413);
        }
        chunks.push(value);
      }
    } catch {
      return json({ error: "Verkeerd formaat." }, 400);
    } finally { reader.releaseLock(); }
  }
  let body;
  try {
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
    body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer));
  } catch {
    return json({ error: "Verkeerd formaat." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Verkeerd formaat." }, 400);
  // Honeypot: bots fill every field; pretend success so they do not retry.
  if (text(body.website, 200)) return json({ ok: true }, 201);

  const kind = KINDS.includes(body.kind) ? body.kind : "";
  const message = text(body.message, MAX_MESSAGE);
  const email = text(body.email, 200);
  if (!kind) return json({ error: "Kies tip, klacht of bug." }, 400);
  if (message.length < 3) return json({ error: "Schrijf iets meer in je bericht." }, 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Dit e-mailadres klopt niet." }, 400);

  // The visitor's IP is only used, hashed, as a short-lived rate-limit key; it is never stored with the feedback.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rateKey = `rate:${await sha256(`${ip}:${Math.floor(Date.now() / (RATE_WINDOW_SECONDS * 1000))}`)}`;
  const count = Number(await env.FEEDBACK.get(rateKey)) || 0;
  if (count >= RATE_LIMIT) return json({ error: "Je hebt net al een paar berichten gestuurd. Probeer het later opnieuw." }, 429);
  await env.FEEDBACK.put(rateKey, String(count + 1), { expirationTtl: RATE_WINDOW_SECONDS });

  const context = body.context && typeof body.context === "object" ? body.context : {};
  const createdAt = new Date().toISOString();
  const emailConfigured = Boolean(env.RESEND_API_KEY && env.FEEDBACK_EMAIL_TO);
  const record = {
    createdAt,
    kind,
    message,
    email,
    page: text(context.page, 300),
    mapView: text(context.mapView, 100),
    viewport: text(context.viewport, 40),
    language: text(context.language, 40),
    appVersion: text(context.appVersion, 40),
    userAgent: text(request.headers.get("User-Agent"), 300),
    country: text(request.cf?.country, 4),
    notification: { status: emailConfigured ? "pending" : "not_configured" },
  };
  const key = `feedback:${createdAt}:${crypto.randomUUID().slice(0, 8)}`;
  const metadata = { kind, preview: message.slice(0, 80) };
  await env.FEEDBACK.put(key, JSON.stringify(record), { metadata });
  if (emailConfigured) {
    const notification = notifyByEmail(env, key, record, metadata).catch(() => {
      console.error("Could not update the feedback email status in KV.");
    });
    if (handlerContext.waitUntil) handlerContext.waitUntil(notification);
    else await notification;
  }
  return json({ ok: true }, 201);
}
