/* Phone menu: the header collapses navigation, language and feedback behind one button. */
(() => {
  const toggle = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#site-menu");
  if (!toggle || !menu) return;
  let scrim = null;

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", window.t ? t(open ? "Close menu" : "Menu") : open ? "Close menu" : "Menu");
    if (open && !scrim) {
      scrim = document.createElement("div");
      scrim.className = "menu-scrim";
      scrim.addEventListener("click", () => setOpen(false));
      document.body.append(scrim);
    } else if (!open && scrim) {
      scrim.remove();
      scrim = null;
    }
  }

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a, [data-feedback-open]")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 821px)").addEventListener("change", (query) => {
    if (query.matches) setOpen(false);
  });
})();

/* About page: remove everything nook saved in this browser. */
(() => {
  const button = document.querySelector("#clear-saved-data");
  if (!button) return;
  const status = document.querySelector("#clear-saved-data-status");
  const text = (key) => (window.t ? t(key) : key);
  button.addEventListener("click", async () => {
    if (!window.confirm(text("Remove your saved routes and settings from this browser?"))) return;
    for (const name of ["localStorage", "sessionStorage"]) {
      try {
        const storage = window[name];
        Object.keys(storage).filter((key) => key.startsWith("nook-")).forEach((key) => storage.removeItem(key));
      } catch { /* Blocked storage holds nothing to clear. */ }
    }
    // Cached tiles and place data show where you looked; the offline app shell stays.
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => /^nook-(runtime|tiles)-/.test(key)).map((key) => caches.delete(key)));
    } catch { /* No Cache Storage in this browser. */ }
    status.textContent = text("Saved data cleared.");
  });
})();
