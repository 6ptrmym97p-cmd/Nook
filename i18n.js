/* Local interface translations. Source descriptions and imported GPX names stay unchanged. */
(() => {
  const VERSION = "20261025-1";
  const STORAGE_KEY = "nook-language-v1";
  const languages = [
    ["en", "English"], ["nl", "Nederlands"], ["ar", "العربية"],
    ["bn", "বাংলা"], ["de", "Deutsch"], ["es", "Español"],
    ["fr", "Français"], ["ha", "Hausa"], ["hi", "हिन्दी"],
    ["id", "Bahasa Indonesia"], ["ja", "日本語"], ["mr", "मराठी"],
    ["pt", "Português"], ["ru", "Русский"], ["sw", "Kiswahili"],
    ["ta", "தமிழ்"], ["te", "తెలుగు"], ["tr", "Türkçe"],
    ["ur", "اردو"], ["vi", "Tiếng Việt"], ["zh", "简体中文"],
  ];
  const supported = new Set(languages.map(([code]) => code));
  const dictionaries = new Map();
  let dictionary = Object.create(null);
  let code = "en";
  const numberFormats = new Map();

  function number(value, options = {}) {
    const locale = code === "zh" ? "zh-CN" : code;
    const key = locale + JSON.stringify(options);
    if (!numberFormats.has(key)) numberFormats.set(key, new Intl.NumberFormat(locale, options));
    return numberFormats.get(key).format(value);
  }

  function normalize(value) {
    const short = String(value || "").toLowerCase().split(/[-_]/)[0];
    return supported.has(short) ? short : "";
  }

  function readPreference() {
    try { return normalize(localStorage.getItem(STORAGE_KEY)); } catch { return ""; }
  }

  function setDocumentLanguage(language) {
    code = language;
    document.documentElement.lang = language;
    document.documentElement.dir = ["ar", "ur"].includes(language) ? "rtl" : "ltr";
  }

  async function loadDictionary(language) {
    if (language === "en") return Object.create(null);
    if (!dictionaries.has(language)) {
      const request = (async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch(new URL(`locales/${language}.json?v=${VERSION}`, document.baseURI), { signal: controller.signal });
          if (!response.ok) throw new Error("Language download failed");
          const data = await response.json();
          if (!data || Array.isArray(data) || typeof data !== "object" || !Object.keys(data).length || Object.values(data).some((value) => typeof value !== "string")) throw new Error("Invalid language file");
          return Object.assign(Object.create(null), data);
        } finally { clearTimeout(timer); }
      })();
      dictionaries.set(language, request);
      request.catch(() => dictionaries.delete(language));
    }
    return dictionaries.get(language);
  }

  function pattern(message) {
    return Object.prototype.hasOwnProperty.call(dictionary, message) ? dictionary[message] : message;
  }

  function text(message, ...values) {
    return pattern(message).replace(/\{(\d+)\}/g, (_, index) => typeof values[index] === "number" ? number(values[index]) : String(values[index] ?? ""));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  // Escape translated wording while preserving the existing escaped template expressions.
  function html(message, ...values) {
    return pattern(message).split(/(\{\d+\})/).map((part) => {
      const match = /^\{(\d+)\}$/.exec(part);
      if (!match) return escapeHtml(part);
      const value = values[match[1]];
      return typeof value === "number" ? number(value) : String(value ?? "");
    }).join("");
  }

  function translateDocument() {
    document.querySelectorAll("[data-i18n-text]").forEach((element) => {
      const keys = JSON.parse(element.getAttribute("data-i18n-text"));
      const nodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
      keys.forEach((key, index) => {
        if (!key || !nodes[index]) return;
        const original = nodes[index].nodeValue;
        nodes[index].nodeValue = original.match(/^\s*/)[0] + text(key) + original.match(/\s*$/)[0];
      });
    });
    document.querySelectorAll("[data-i18n-attrs]").forEach((element) => {
      for (const [attribute, key] of Object.entries(JSON.parse(element.getAttribute("data-i18n-attrs")))) element.setAttribute(attribute, text(key));
    });
    document.querySelectorAll("[data-i18n-number]").forEach((element) => {
      element.textContent = number(Number(element.dataset.i18nNumber));
    });
    const url = new URL(location.href);
    if (code !== "en" || url.searchParams.has("lang")) {
      url.searchParams.set("lang", code);
      try { history.replaceState(history.state, "", url); } catch { /* Navigation still works without history access. */ }
      document.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("#") || anchor.hasAttribute("download")) return;
        const target = new URL(href, location.href);
        if (target.origin !== location.origin || !/(?:\/|\.html)$/.test(target.pathname)) return;
        target.searchParams.set("lang", code);
        anchor.setAttribute("href", target.pathname + target.search + target.hash);
      });
    }
  }

  function notice(message) {
    let element = document.querySelector("#language-notice");
    if (!element) {
      element = document.createElement("p");
      element.id = "language-notice";
      element.className = "language-notice";
      element.setAttribute("role", "status");
      document.body.append(element);
    }
    element.textContent = message;
    element.hidden = !message;
  }

  async function changeLanguage(language, select) {
    if (!supported.has(language) || language === code) return;
    select.disabled = true;
    notice(text("Loading language…"));
    try {
      await loadDictionary(language);
      try { localStorage.setItem(STORAGE_KEY, language); } catch { /* The URL preserves the choice if storage is blocked. */ }
      const target = new URL(location.href);
      target.searchParams.set("lang", language);
      location.assign(target.href);
    } catch {
      select.value = code;
      select.disabled = false;
      notice(text("This language is not available offline yet. Connect to the internet and try again."));
    }
  }

  const requested = normalize(new URL(location.href).searchParams.get("lang")) || readPreference() || "en";
  let failed = false;
  const ready = loadDictionary(requested).then((data) => {
    dictionary = data;
    setDocumentLanguage(requested);
  }).catch(() => { failed = true; setDocumentLanguage("en"); });
  const domReady = document.readyState === "loading"
    ? new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true })) : Promise.resolve();
  const pageReady = Promise.all([ready, domReady]).then(() => {
    translateDocument();
    const select = document.querySelector("#language-select");
    if (select) {
      select.replaceChildren(...languages.map(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        option.lang = value;
        return option;
      }));
      select.value = code;
      const codeLabel = document.querySelector(".language-code");
      if (codeLabel) codeLabel.textContent = code.toUpperCase();
      select.disabled = false;
      select.addEventListener("change", () => changeLanguage(select.value, select));
    }
    if (failed) notice(text("This language is not available offline yet. Connect to the internet and try again."));
    // The first language request may precede service-worker installation. Cache it
    // once this page is controlled so the chosen language survives offline reloads.
    if (code !== "en" && "serviceWorker" in navigator) {
      const cacheLanguage = () => fetch(new URL(`locales/${code}.json?v=${VERSION}`, document.baseURI)).catch(() => {});
      if (navigator.serviceWorker.controller) cacheLanguage();
      else navigator.serviceWorker.addEventListener("controllerchange", cacheLanguage, { once: true });
    }
    document.querySelector('nav [aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  });

  window.NookI18n = { languages, ready: pageReady, text, html, number, escapeHtml, get code() { return code; }, get locale() { return code === "zh" ? "zh-CN" : code; } };
  window.t = text;
  window.th = html;
})();
