# Vendored libraries and fonts

These browser builds are served locally to avoid third-party CDN startup delays. Package archives were downloaded from registry.npmjs.org over verified TLS and checked against each package version's npm `dist.integrity` before extraction. Do not remove HTML SRI checks or disable TLS verification when updating them.

- Supercluster 8.0.1: https://github.com/mapbox/supercluster — ISC; `supercluster-LICENSE`.
- Leaflet 1.9.4: https://github.com/Leaflet/Leaflet — BSD-2-Clause; `leaflet-1.9.4/LICENSE`.
- Leaflet.markercluster 1.5.3: https://github.com/Leaflet/Leaflet.markercluster — MIT; `leaflet.markercluster-1.5.3/MIT-LICENCE.txt`.
- DM Sans 5.3.0 (@fontsource-variable/dm-sans, Latin and Latin Extended, optical size and weight axes): https://github.com/googlefonts/dm-fonts — OFL-1.1; `dm-sans-5.3.0/OFL.txt`. Served locally so visitors' IP addresses never reach a font CDN.

Supercluster's documented `load`, `getClusters`, `getClusterExpansionZoom` and `getLeaves` APIs power the background worker. `.nojekyll` keeps GitHub Pages serving these static assets directly.
