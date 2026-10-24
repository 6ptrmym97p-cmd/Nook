# Interface languages

Nook opens in English unless the visitor has chosen another supported language. A compact native selector is available in the header on every page: a globe on mobile and a globe with the current language code on desktop. The menu retains full language names, accessible labeling and a visible keyboard focus ring. A choice is saved in `nook-language-v1` and included in internal links as `?lang=…`, so it also works when browser storage is unavailable.

The 21 supported languages are English (`en`), Dutch (`nl`), Arabic (`ar`), Bengali (`bn`), German (`de`), Spanish (`es`), French (`fr`), Hausa (`ha`), Hindi (`hi`), Indonesian (`id`), Japanese (`ja`), Marathi (`mr`), Portuguese (`pt`), Russian (`ru`), Swahili (`sw`), Tamil (`ta`), Telugu (`te`), Turkish (`tr`), Urdu (`ur`), Vietnamese (`vi`) and Simplified Chinese (`zh`). Arabic and Urdu use a right-to-left layout; the geographic map retains its normal orientation.

## How it works

- HTML and JavaScript use English source messages. `t(message, ...values)` returns plain text; `th(message, ...values)` escapes translated HTML wording while retaining the existing escaped template expressions.
- Static HTML marks direct text nodes with `data-i18n-text` and accessible labels, titles, placeholders and table labels with `data-i18n-attrs`. Links, icons and input controls retain their markup.
- `locales/en.json` is the source catalogue. Every other catalogue contains the same keys and preserves interpolation fields such as `{0}` and `{1}`. Brand names and file formats remain unchanged.
- `i18n.js` loads only the selected translation file. English uses the source wording and makes no language-file request. `bootstrap.js` starts the classic app and feedback scripts after the chosen language is ready.
- The service worker caches visited languages for offline reloads. A first request for an unavailable language falls back to English with a visible notice. A failed language change retains the current selection.
- Country names and number formats use `Intl`. App-generated source summaries are translated; original provider descriptions, place and host names, imported route names and quoted price details stay in their source language.
- Additional language files were prepared with machine translation, with a manual pass over core labels and English source wording. They have not all been reviewed by native speakers. Legal summaries retain their source links and local-rule qualifications.

## Updating wording

Add the English source message to `locales/en.json` and translate it in every other catalogue. Preserve all numbered fields, proper names and source links. If you change an English key, update its uses and all catalogues together. Bump the translation asset version in `i18n.js`, HTML and the service worker when publishing changed files.

The Cloudflare Pages build copies `locales/` into `dist/`. No translation service is contacted by visitors, and GPX files are never sent for translation.

## Checks

```bash
node --test scripts/test-i18n.mjs scripts/test-map-data.mjs scripts/test-service-worker.mjs scripts/test-feedback.mjs
```

With the local static server running and Playwright/Chromium available:

```bash
node scripts/test-i18n-browser.cjs
node scripts/test-app-browser.cjs
node scripts/test-map-browser.cjs
```

The language browser checks cover all 21 maps, filters, feedback dialogs and information pages, plus narrow and desktop layouts, RTL, saved GPX data, language changes, navigation and offline reloads. Feedback requests in that test are intercepted locally and do not submit real messages.
