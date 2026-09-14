#!/usr/bin/env node

// Rebuild data/us-state-map-2020.json from the Census-derived us-atlas
// boundary file. This script is a maintainer tool; the student app does not
// download libraries or contact a public API at runtime.
import fs from 'node:fs/promises';
import { feature } from '/tmp/aphg-map-build/node_modules/topojson-client/dist/topojson-client.js';
import { geoPath } from '/tmp/aphg-map-build/node_modules/d3-geo/src/index.js';

const input = process.argv[2] || '/tmp/states.json';
const output = new URL('../data/us-state-map-2020.json', import.meta.url);
const topology = JSON.parse(await fs.readFile(input, 'utf8'));
const collection = feature(topology, topology.objects.states);
const path = geoPath();

// Official 2020 Census resident population totals. These 50 states plus the
// District of Columbia sum to the published U.S. total of 331,449,281.
const population = {
  '01':5024279,'02':733391,'04':7151502,'05':3011524,'06':39538223,
  '08':5773714,'09':3605944,'10':989948,'11':689545,'12':21538187,
  '13':10711908,'15':1455271,'16':1839106,'17':12812508,'18':6785528,
  '19':3190369,'20':2937880,'21':4505836,'22':4657757,'23':1362359,
  '24':6177224,'25':7029917,'26':10077331,'27':5706494,'28':2961279,
  '29':6154913,'30':1084225,'31':1961504,'32':3104614,'33':1377529,
  '34':9288994,'35':2117522,'36':20201249,'37':10439388,'38':779094,
  '39':11799448,'40':3959353,'41':4237256,'42':13002700,'44':1097379,
  '45':5118425,'46':886667,'47':6910840,'48':29145505,'49':3271616,
  '50':643077,'51':8631393,'53':7705281,'54':1793716,'55':5893718,
  '56':576851
};

const rows = collection.features
  .filter(state => Object.hasOwn(population, String(state.id).padStart(2, '0')))
  .map(state => {
    const id = String(state.id).padStart(2, '0');
    const [cx, cy] = path.centroid(state);
    return {
      id,
      name: state.properties.name,
      population: population[id],
      cx: Math.round(cx * 10) / 10,
      cy: Math.round(cy * 10) / 10,
      path: path(state)
    };
  });

const total = rows.reduce((sum, row) => sum + row.population, 0);
if (rows.length !== 51 || total !== 331449281) {
  throw new Error(`Unexpected Census snapshot: ${rows.length} areas, total ${total}`);
}

await fs.mkdir(new URL('../data/', import.meta.url), { recursive: true });
await fs.writeFile(output, JSON.stringify({
  version: 1,
  viewBox: '0 0 975 610',
  source: {
    boundaries: 'U.S. Census Bureau cartographic boundaries via us-atlas 3.0.1',
    population: 'U.S. Census Bureau, 2020 Decennial Census resident population',
    populationUrl: 'https://www.census.gov/data/tables/2020/dec/2020-apportionment-data.html',
    generated: '2026-09-14'
  },
  states: rows
}));

console.log(`Wrote ${rows.length} state/DC paths; population total ${total}.`);
