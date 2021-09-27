import { html, render, makeComponent } from './makeComponent.js';

const onConstruct = host => {
  const state = {};

  host.useState(state);
}

const onConnected = host => {
  const el = host.shadowRoot.querySelector("#leaflet-map");

  const map = L.map(el, {drawControl: true}).setView([30.683, 9.099], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

  (async () => {
    let clubs = await fetch(`https://api2.hackclub.com/v0.1/Club Applications/Clubs Dashboard`).then(res => res.json());
    clubs.forEach(({ fields: x }) => {
        if (!(x?.Latitude &&  x?.Longitude)) return;

        let marker = new L.marker([ x.Latitude, x.Longitude ]).addTo(map);
        marker.bindPopup(`<b>${x?.Venue}</b>`)
      })

  })()


}

const styles = html`
  <link rel="stylesheet" 
    href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>
  <style>
    #leaflet-map {
      width: 100%;
      height: 600px;
    }
  </style>
`

const template = (host) => html`
  ${styles}
  <div id="leaflet-map"></div>
`

makeComponent({
  name: "club-map",
  template,
  onConstruct,
  onConnected
})