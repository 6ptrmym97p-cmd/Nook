(() => {
  const dialog = document.createElement("dialog");
  dialog.className = "feedback-dialog";
  dialog.setAttribute("aria-labelledby", "feedback-title");
  dialog.innerHTML = `
    <form class="feedback-form" novalidate>
      <button class="dialog-close" type="button" data-feedback-close aria-label="Sluiten">×</button>
      <p class="eyebrow">Feedback</p>
      <h2 id="feedback-title">Tip, klacht of bug?</h2>
      <fieldset class="feedback-kinds">
        <legend class="visually-hidden">Soort bericht</legend>
        <label><input type="radio" name="kind" value="tip" checked /><span>Tip</span></label>
        <label><input type="radio" name="kind" value="klacht" /><span>Klacht</span></label>
        <label><input type="radio" name="kind" value="bug" /><span>Bug</span></label>
      </fieldset>
      <label class="feedback-field">
        <span>Je bericht</span>
        <textarea name="message" rows="5" maxlength="2000" required placeholder="Wat kan beter, wat ging er mis, of welke plek mist er?"></textarea>
      </label>
      <label class="feedback-field">
        <span>E-mail <small>(optioneel, alleen als je antwoord wilt)</small></span>
        <input type="email" name="email" maxlength="200" autocomplete="email" />
      </label>
      <label class="feedback-trap" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
      <p class="feedback-privacy">We bewaren je bericht, de pagina, het kaartbeeld en je browsertype, zodat we het probleem kunnen terugvinden.</p>
      <p class="feedback-status" role="status" aria-live="polite"></p>
      <div class="feedback-actions">
        <button class="button button-primary" type="submit">Versturen</button>
      </div>
    </form>`;
  document.body.append(dialog);

  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "feedback-fab";
  fab.setAttribute("aria-label", "Tip, klacht of bug melden");
  fab.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 5v2h10V9H7Zm0 4v2h7v-2H7Z"/></svg>`;
  document.body.append(fab);

  const form = dialog.querySelector("form");
  const status = dialog.querySelector(".feedback-status");
  const submit = dialog.querySelector('[type="submit"]');
  let opener = null;

  function open(event) {
    opener = event?.currentTarget || null;
    status.textContent = "";
    status.classList.remove("is-error");
    dialog.showModal();
    form.elements.message.focus();
  }

  function close() {
    dialog.close();
    opener?.focus();
  }

  function context() {
    // `map` is app.js's top-level Leaflet map, present on the map page only.
    const leafletMap = typeof map !== "undefined" && typeof map?.getCenter === "function" ? map : null;
    const view = leafletMap
      ? `${leafletMap.getCenter().lat.toFixed(4)},${leafletMap.getCenter().lng.toFixed(4)},${leafletMap.getZoom()}`
      : "";
    const appScript = [...document.scripts].find((script) => /app\.js\?v=/.test(script.src));
    return {
      page: location.pathname + location.search,
      mapView: view,
      viewport: `${innerWidth}x${innerHeight}`,
      language: navigator.language || "",
      appVersion: appScript ? new URL(appScript.src).searchParams.get("v") : "",
    };
  }

  document.querySelectorAll("[data-feedback-open]").forEach((button) => button.addEventListener("click", open));
  fab.addEventListener("click", open);
  dialog.querySelector("[data-feedback-close]").addEventListener("click", close);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = form.elements.message.value.trim();
    if (message.length < 3) {
      status.textContent = "Schrijf iets meer in je bericht.";
      status.classList.add("is-error");
      form.elements.message.focus();
      return;
    }
    submit.disabled = true;
    status.classList.remove("is-error");
    status.textContent = "Versturen…";
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: form.elements.kind.value,
          message,
          email: form.elements.email.value.trim(),
          website: form.elements.website.value,
          context: context(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Versturen lukte niet.");
      form.reset();
      status.textContent = "Bedankt! Je bericht is ontvangen.";
      window.setTimeout(() => { if (dialog.open) close(); }, 1800);
    } catch (error) {
      status.textContent = navigator.onLine === false
        ? "Je bent offline. Probeer het opnieuw zodra je verbinding hebt."
        : `${error.message} Probeer het later opnieuw.`;
      status.classList.add("is-error");
    } finally {
      submit.disabled = false;
    }
  });
})();
