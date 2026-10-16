# Vendored map libraries

These browser builds are served locally to avoid third-party CDN startup delays. Package archives were downloaded from registry.npmjs.org over verified TLS and checked against each package version's npm `dist.integrity` before extraction. Do not remove HTML SRI checks or disable TLS verification when updating them.

- Supercluster 8.0.1: https://github.com/mapbox/supercluster — ISC; `supercluster-LICENSE`.
- Leaflet 1.9.4: https://github.com/Leaflet/Leaflet — BSD-2-Clause; `leaflet-1.9.4/LICENSE`.
- Leaflet.markercluster 1.5.3: https://github.com/Leaflet/Leaflet.markercluster — MIT; `leaflet.markercluster-1.5.3/MIT-LICENCE.txt`.

Supercluster's documented `load`, `getClusters`, `getClusterExpansionZoom` and `getLeaves` APIs power the background worker. `.nojekyll` keeps GitHub Pages serving these static assets directly.
