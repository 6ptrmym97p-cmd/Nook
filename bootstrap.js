/* Load classic scripts in order after the selected language is ready. */
(() => {
  function load(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source;
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    });
  }
  NookI18n.ready.then(async () => {
    for (const source of [document.body.dataset.appScript, document.body.dataset.feedbackScript].filter(Boolean)) await load(source);
  }).catch(() => {
    const hint = document.querySelector("#map-data-hint");
    if (hint) hint.hidden = true;
    const message = document.createElement("p");
    message.className = "language-notice";
    message.setAttribute("role", "alert");
    message.textContent = t("The page could not be loaded. Check your connection and reload.");
    document.body.append(message);
  });
})();
