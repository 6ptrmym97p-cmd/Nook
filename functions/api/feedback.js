// Cloudflare Pages Function: stores visitor feedback in the FEEDBACK KV namespace.
const KINDS = ["tip", "klacht", "bug"];
const MAX_BODY_BYTES = 8000;
const MAX_MESSAGE = 2000;
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 3600;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
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

export async function onRequestPost({ request, env }) {
  if (!env.FEEDBACK) return json({ error: "Feedback is nog niet ingesteld." }, 503);

  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "Ongeldige herkomst." }, 403);
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) return json({ error: "Verkeerd formaat." }, 415);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "Bericht is te lang." }, 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Verkeerd formaat." }, 400);
  }
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
  };
  await env.FEEDBACK.put(`feedback:${createdAt}:${crypto.randomUUID().slice(0, 8)}`, JSON.stringify(record), {
    metadata: { kind, preview: message.slice(0, 80) },
  });
  return json({ ok: true }, 201);
}
