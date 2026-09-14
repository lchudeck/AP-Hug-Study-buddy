# Bundled map data

`us-state-map-2020.json` contains precomputed SVG paths and centroids for the
50 states and District of Columbia, plus the official 2020 Census resident
population total for each area. The state geometry comes from `us-atlas`
3.0.1, whose source geometry is published by the U.S. Census Bureau.

The browser loads this same-origin file only when a student opens Maps &
Visuals. It does not contact the Census API, a CDN, or an AI image service.

Sources:

- U.S. Census Bureau, 2020 Census Apportionment Results:
  https://www.census.gov/data/tables/2020/dec/2020-apportionment-data.html
- Census-derived U.S. Atlas topology:
  https://github.com/topojson/us-atlas

To regenerate, first install `topojson-client@3.1.0` and `d3-geo@3.1.1` under
`/tmp/aphg-map-build`, download `states-albers-10m.json` from `us-atlas`
3.0.1 to `/tmp/states.json`, then run:

```sh
node scripts/generate-authentic-us-maps.mjs /tmp/states.json
```
