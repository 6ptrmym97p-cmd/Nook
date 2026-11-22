/* Camping rules page: search a country and show its rule, source and regional notes. */
(() => {
  const data = window.NOOK_COUNTRY_RULES || { countries: {}, parents: {}, guides: {} };
  const input = document.querySelector("#rules-country");
  const results = document.querySelector("#rules-results");
  const hint = document.querySelector("#rules-hint");
  const card = document.querySelector("#country-rule");
  const guideSection = document.querySelector("#country-guides");
  if (!input || !card) return;
  // Country guide pages (/wild-camping/norway) name their country; the rules page itself has none.
  const preset = (card.dataset.country || "").toUpperCase();

  const STATUS = {
    access: ["Right of access", "status-good"],
    allowed: ["Mostly allowed", "status-good"],
    designated: ["Designated sites", "status-mixed"],
    local: ["Local rules", "status-mixed"],
    regional: ["Varies by region", "status-mixed"],
    permission: ["Permission needed", "status-strict"],
    prohibited: ["Not allowed", "status-strict"],
    unknown: ["Not researched yet", "status-unknown"],
  };
  const ICON_EXTERNAL = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  const ICON_CHEVRON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  const language = () => NookI18n.code;
  const escape = (value) => NookI18n.escapeHtml(String(value ?? ""));
  const displayNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames([NookI18n.locale], { type: "region" }) : null;
  const englishNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
  const countries = (typeof FILTER_COUNTRIES !== "undefined" ? FILTER_COUNTRIES : []).map((country) => ({
    code: country.code,
    name: displayNames?.of(country.code) || country.name,
    english: englishNames?.of(country.code) || country.name,
    bounds: country.bounds,
  }));
  const byCode = new Map(countries.map((country) => [country.code, country]));
  const normalize = (value) => String(value).toLocaleLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const nameOf = (code) => byCode.get(code)?.name || code;

  function statusOf(code) {
    return data.countries[code]?.status || "unknown";
  }

  function localized(value) {
    if (!value) return "";
    if (value.key) return t(value.key);
    return value[language()] || value.en || "";
  }

  function usesEnglishFallback(entry) {
    if (!entry || ["en", "nl"].includes(language())) return false;
    return [entry.rule, entry.text].some((value) => value && !value.key);
  }

  function chip(code) {
    const [label, className] = STATUS[statusOf(code)] || STATUS.unknown;
    return `<span class="status-chip ${className}">${escape(t(label))}</span>`;
  }

  function countryFromMapView() {
    try {
      const view = JSON.parse(localStorage.getItem("nook-map-view-v1") || "null");
      if (!view || !Number.isFinite(view.lat) || !Number.isFinite(view.lng)) return "";
      const match = countries
        .filter(({ bounds: [[south, west], [north, east]] }) => view.lat >= south && view.lat <= north && view.lng >= west && view.lng <= east)
        .sort((a, b) => {
          const area = ({ bounds: [[s, w], [n, e]] }) => (n - s) * (e - w);
          return area(a) - area(b);
        })[0];
      return match?.code || "";
    } catch {
      return "";
    }
  }

  function setUrl(code) {
    const url = new URL(location.href);
    if (code && code === preset && !url.searchParams.has("country")) return;
    if (code) url.searchParams.set("country", code);
    else url.searchParams.delete("country");
    try { history.replaceState(history.state, "", url); } catch { /* The page still works without history access. */ }
  }

  function renderGuides(entry) {
    const ids = (entry?.guides || []).filter((id) => data.guides[id]);
    guideSection.hidden = !ids.length;
    if (!ids.length) {
      guideSection.innerHTML = "";
      return;
    }
    guideSection.innerHTML = `
      <h2>${escape(t("Regions"))}</h2>
      <ul class="guide-list">
        ${ids.map((id, index) => {
          const guide = data.guides[id];
          return `
            <li id="${escape(id)}">
              <button class="disclosure-toggle" type="button" aria-expanded="${index === 0}" aria-controls="${escape(id)}-content">
                <span><span class="disclosure-title">${escape(t(guide.title))}</span><span class="disclosure-summary">${escape(t(guide.location))}</span></span>
                ${ICON_CHEVRON}
              </button>
              <div class="guide-content" id="${escape(id)}-content"${index === 0 ? "" : " hidden"}>
                <p>${escape(t(guide.text))}</p>
                <dl class="guide-facts">${guide.facts.map(([label, value]) => `<dt>${escape(t(label))}</dt><dd>${escape(t(value))}</dd>`).join("")}</dl>
                ${guide.check ? `<p><strong>${escape(t("Please check:"))}</strong> ${escape(t(guide.check))}</p>` : ""}
                <a class="source-link" href="${escape(guide.source.url)}" target="_blank" rel="noreferrer">${escape(guide.source.name)}${ICON_EXTERNAL}</a>
              </div>
            </li>`;
        }).join("")}
      </ul>`;
    guideSection.querySelectorAll(".disclosure-toggle").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        document.getElementById(toggle.getAttribute("aria-controls")).hidden = !open;
      });
    });
  }

  function render(code, { fromMap = false } = {}) {
    if (!byCode.has(code)) {
      card.innerHTML = "";
      renderGuides(null);
      hint.hidden = true;
      return;
    }
    const entry = data.countries[code];
    const parent = !entry && data.parents[code];
    const parentEntry = parent && data.countries[parent];
    let body = "";
    if (entry) {
      const text = localized(entry.text);
      body = `
        <p class="country-rule-main">${escape(localized(entry.rule))}</p>
        ${text ? `<p>${escape(text)}</p>` : ""}
        ${usesEnglishFallback(entry) ? `<p class="rules-language-note">${escape(t("Country rules are shown in English."))}</p>` : ""}
        ${entry.sources.map((source) => `<a class="source-link" href="${escape(source.url)}" target="_blank" rel="noreferrer">${escape(t("Source: {0}", source.name))}${ICON_EXTERNAL}</a>`).join("")}`;
    } else {
      body = `
        <p class="country-rule-main">${escape(t("No checked source yet."))}</p>
        ${parent ? `<p>${escape(t("Part of {0}. Local rules can differ.", nameOf(parent)))}</p>` : ""}
        ${parentEntry ? `<button class="button button-secondary" type="button" data-country="${escape(parent)}">${escape(t("Rules in {0}", nameOf(parent)))}</button>` : ""}
        <p class="muted">${escape(t("Follow the rules below and ask locally where you may stay."))}</p>`;
    }
    card.innerHTML = `
      <div class="country-rule-head">
        <h2>${escape(nameOf(code))}</h2>
        ${chip(code)}
      </div>
      ${body}`;
    card.querySelector("[data-country]")?.addEventListener("click", (event) => select(event.currentTarget.dataset.country));
    renderGuides(entry);
    input.placeholder = nameOf(code);
    hint.textContent = t("From your map view");
    hint.hidden = !fromMap;
    setUrl(code);
  }

  function select(code, options) {
    input.value = "";
    closeResults();
    render(code, options);
  }

  function closeResults() {
    results.hidden = true;
    results.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
  }

  function search() {
    const query = normalize(input.value.trim());
    if (!query) {
      closeResults();
      return;
    }
    const matches = countries
      .map((country) => {
        const name = normalize(country.name);
        const english = normalize(country.english);
        const rank = country.code.toLowerCase() === query ? 0 : name.startsWith(query) ? 1 : english.startsWith(query) ? 2 : name.includes(query) || english.includes(query) ? 3 : -1;
        return { country, rank };
      })
      .filter((item) => item.rank >= 0)
      .sort((a, b) => a.rank - b.rank || a.country.name.localeCompare(b.country.name, NookI18n.locale))
      .slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(({ country }) => `<li><button type="button" data-code="${escape(country.code)}"><span>${escape(country.name)}</span>${chip(country.code)}</button></li>`).join("")
      : `<li class="muted" style="padding: 12px">${escape(t("No country found."))}</li>`;
    results.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  NookI18n.ready.then(() => {
    input.setAttribute("aria-expanded", "false");
    input.addEventListener("input", search);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const first = results.querySelector("button[data-code]");
        if (first) select(first.dataset.code);
      } else if (event.key === "ArrowDown") {
        const first = results.querySelector("button[data-code]");
        if (first) { event.preventDefault(); first.focus(); }
      } else if (event.key === "Escape") {
        input.value = "";
        closeResults();
      }
    });
    results.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-code]");
      if (button) select(button.dataset.code);
    });
    results.addEventListener("keydown", (event) => {
      const buttons = [...results.querySelectorAll("button[data-code]")];
      const index = buttons.indexOf(document.activeElement);
      if (event.key === "ArrowDown" && index < buttons.length - 1) { event.preventDefault(); buttons[index + 1].focus(); }
      if (event.key === "ArrowUp") { event.preventDefault(); (index > 0 ? buttons[index - 1] : input).focus(); }
      if (event.key === "Escape") { closeResults(); input.focus(); }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".rules-search")) closeResults();
    });

    const requested = (new URL(location.href).searchParams.get("country") || preset)?.toUpperCase();
    if (requested && byCode.has(requested)) {
      render(requested);
    } else {
      const fromMap = countryFromMapView();
      if (fromMap) render(fromMap, { fromMap: true });
      else render({ nl: "NL", de: "DE", fr: "FR", es: "ES", pt: "PT", tr: "TR", ja: "JP" }[language()] || "");
    }
  });
})();
