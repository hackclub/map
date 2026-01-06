import { html, render, makeComponent } from "./makeComponent.js";
import L from "leaflet";

const onConstruct = (host) => {
  const state = {};

  host.useState(state);
};

const parseHashParams = () => {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const lat = parseFloat(params.get("lat"));
  const lng = parseFloat(params.get("lng"));
  const zoom = parseInt(params.get("z"), 10);
  if (!isNaN(lat) && !isNaN(lng)) {
    return { lat, lng, zoom: isNaN(zoom) ? 10 : zoom };
  }
  return null;
};

const updateHash = (lat, lng, zoom) => {
  const hash = `lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}&z=${zoom}`;
  window.history.replaceState(null, null, `#${hash}`);
};

const onConnected = (host) => {
  const el = host.shadowRoot.querySelector("#leaflet-map");

  const hashParams = parseHashParams();
  const defaultCenter = [30.683, 9.099];
  const defaultZoom = 2;

  const map = L.map(el, {
    drawControl: true,
    zoomControl: false,
    center: hashParams ? [hashParams.lat, hashParams.lng] : defaultCenter,
    zoom: hashParams ? hashParams.zoom : defaultZoom,
    minZoom: 2,
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
  });

  L.control.zoom({ position: "topright" }).addTo(map);

  map.on("moveend", () => {
    const center = map.getCenter();
    updateHash(center.lat, center.lng, map.getZoom());
  });

  L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  (async () => {
    let clubs = await fetch(
      `https://clubapi.hackclub.com/clubs/map`
    ).then((res) => res.json());
    clubs.forEach(({ fields: x }) => {
      if (!x.club_status || x.club_status !== "Active") return;
      if (!(x?.venue_lat_fuzz && x?.venue_lng_fuzz)) return;

      const style = `
          transform-origin: left top;
          height: 20px;
          border-radius: 50%;
        `;

      const icon = new L.divIcon({
        html: `<img style="${style}" src="https://assets.hackclub.com/icon-rounded.png"/>`,
        className: "clear",
      });

      let marker = new L.marker([x.venue_lat_fuzz, x.venue_lng_fuzz], { icon }).addTo(map);
      marker.bindPopup(`<b>${x?.club_name}</b>`);
    });
  })();
};

const styles = html`
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""
  />
  <style>
    #leaflet-map {
      width: 100%;
      height: 100vh;
    }
    .leaflet-container {
      font-family: "Phantom Sans";
    }
    .leaflet-popup-close-button {
      display: none;
    }
  </style>
`;

const template = (host) => html`
  ${styles}
  <div id="leaflet-map"></div>
`;

makeComponent({
  name: "club-map",
  template,
  onConstruct,
  onConnected,
});
