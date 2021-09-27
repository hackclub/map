import { html, render, makeComponent } from './js/makeComponent.js';
import "./js/test-comp.js";
import "./club-map.js";

// this is how I can pass rich data
// is there a better way?

render(document.body, html`
  <div id="leaflet-map"></div>
  <club-map></club-map>
`)

const el = document.querySelector("#leaflet-map");

const map = L.map(el, {drawControl: true}).setView([30.683, 9.099], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

console.log(el);