const feedbackServerMessages = {
  "Feedback is nog niet ingesteld.": "Feedback is not available yet.",
  "Ongeldige herkomst.": "Invalid origin.",
  "Verkeerd formaat.": "Wrong format.",
  "Bericht is te lang.": "Message is too long.",
  "Kies tip, klacht of bug.": "Choose tip, complaint or bug.",
  "Schrijf iets meer in je bericht.": "Please add a little more detail to your message.",
  "Dit e-mailadres klopt niet.": "This email address is incorrect.",
  "Je hebt net al een paar berichten gestuurd. Probeer het later opnieuw.": "You just sent a few messages. Please try again later."
};
(() => {
  const dialog = document.createElement("dialog");
  dialog.className = "feedback-dialog";
  dialog.setAttribute("aria-labelledby", "feedback-title");
  dialog.innerHTML = `
    <form class="feedback-form" novalidate>
      <button class="dialog-close" type="button" data-feedback-close aria-label="${th("Close")}">×</button>
      <p class="eyebrow">${th("Feedback")}</p>
      <h2 id="feedback-title">${th("Suggestion, complaint or bug?")}</h2>
      <fieldset class="feedback-kinds">
        <legend class="visually-hidden">${th("Type of message")}</legend>
        <label><input type="radio" name="kind" value="tip" checked /><span>${th("Suggestion")}</span></label>
        <label><input type="radio" name="kind" value="klacht" /><span>${th("Complaint")}</span></label>
        <label><input type="radio" name="kind" value="bug" /><span>${th("Bug")}</span></label>
      </fieldset>
      <label class="feedback-field">
        <span>${th("Your message")}</span>
        <textarea name="message" rows="5" maxlength="2000" required placeholder="${th("What could be improved, what went wrong, or what place is missing?")}"></textarea>
      </label>
      <label class="feedback-field">
        <span>${th("Email")} <small>${th("(optional, if you would like a reply)")}</small></span>
        <input type="email" name="email" maxlength="200" autocomplete="email" />
      </label>
      <label class="feedback-trap" aria-hidden="true">${th("Website")}<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
      <p class="feedback-privacy">${th("We store your message, page address, map position and browser type to help investigate the issue.")}</p>
      <p class="feedback-status" role="status" aria-live="polite"></p>
      <div class="feedback-actions">
        <button class="button button-primary" type="submit">${th("Send")}</button>
      </div>
    </form>`;
  document.body.append(dialog);

  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "feedback-fab";
  fab.setAttribute("aria-label", t("Send a suggestion, complaint or bug report"));
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
      language: document.documentElement.lang || navigator.language || "",
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
      status.textContent = t("Please add a little more detail to your message.");
      status.classList.add("is-error");
      form.elements.message.focus();
      return;
    }
    submit.disabled = true;
    status.classList.remove("is-error");
    status.textContent = t("Sending…");
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
      // Static fallback pages can return 200 without accepting any feedback.
      if (!response.ok || result?.ok !== true) throw new Error(t(feedbackServerMessages[result?.error] || "Could not send your message."));
      form.reset();
      status.textContent = t("Thank you! Your message has been received.");
      window.setTimeout(() => { if (dialog.open) close(); }, 1800);
    } catch (error) {
      status.textContent = navigator.onLine === false
        ? t("You are offline. Please try again once you are connected.")
        : t("{0} Please try again later.", error.message);
      status.classList.add("is-error");
    } finally {
      submit.disabled = false;
    }
  });
})();
