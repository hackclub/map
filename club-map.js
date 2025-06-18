import { html, render, makeComponent } from "./makeComponent.js";
import maplibregl from 'maplibre-gl';

const onConstruct = (host) => {
  const state = {};

  host.useState(state);
};


// thanks https://blog.wxm.be/2024/01/24/maplibre-layer-visibility-control.html
class LoadingControl {
  constructor() {
    this._container = document.createElement("div");
    this._container.classList.add(
      // Built-in classes for consistency
      "maplibregl-ctrl",
      "maplibregl-ctrl-group",

      // custom class for extra styles
      "clubs-loading"
    );
  }

  onAdd(map) {
    this._map = map;
    this._container.innerHTML = `<div>Loading Clubs</div> <div class="lds-dual-ring">`;
    return this._container;
  }

  onRemove(map) {
    // Not sure why we have to do this ourselves since we are not the ones
    // adding us to the map.
    // Copied from their example so keeping it in.
    this._container.parentNode.removeChild(this._container);
    // This might be to help garbage collection? Also from their example.
    // Or perhaps to ensure calls to this object do not change the map still
    // after removal.
    this._map = undefined;
  }
}

const onConnected = (host) => {
  const el = host.shadowRoot.querySelector("#map");

  const map = new maplibregl.Map({
    container: el,

    // I made a custom style to match the
    // raster tiles previously used
    // contact me on slack (@spidunno) if
    // you'd like more info or a download
    style: "https://api.maptiler.com/maps/01977e48-8dcc-714c-8aad-216e5d3ce24d/style.json?key=fpp4RkrnV3OrM8QdrJoe",

    // disable pitching the map
    maxPitch: 0,
    // and rotating it
    dragRotate: false,

    zoom: 1,
    canvasContextAttributes: { antialias: true }
  });
  const nav = new maplibregl.NavigationControl({
    showCompass: false
  });
  map.addControl(nav, "top-right");

  map.on('load', async () => {

    // Add loading indicator, remove it later
    const loading = new LoadingControl();
    map.addControl(loading, "top-right");

    // Load Hack Club logo to use as icon
    const image = await map.loadImage("https://assets.hackclub.com/icon-rounded.png");
    map.addImage("hackclub", image.data);

    let clubs = await fetch(
      `https://api2.hackclub.com/v0.1/Club Applications/Clubs Dashboard`
    ).then((res) => res.json());

    const features = clubs
      .filter(({ fields: x }) =>
        // Filter out all clubs that are inactive 
        (x.status !== "inactive") &&

        // Or don't have a latitude / longitude
        (x.Latitude && x.Longitude)
        /* It's possible that a club
           could be at Latitude 0
           or Longitude 0 and that would
           break, but I don't think
           it's a very big deal */
      )

      // turn every club in the list
      // into a GeoJSON point feature
      .map(({ fields: x }) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [x.Longitude, x.Latitude]
        },
        properties: {
          description: `<b>${x?.Venue}</b>`
        }
      }));

    map.addSource("clubs", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features
      }
    });

    map.addLayer({
      id: "clubs",
      type: "symbol",
      source: "clubs",
      layout: {
        "icon-image": "hackclub",

        // icon size is 512x512 px so we scale it by
        // 20/512 to make it appear 20x20 px instead
        "icon-size": 0.0390625,

        // prevent overlapping icons from disappearing
        "icon-allow-overlap": true
      }
    });

    // remove loading spinner now that clubs are loaded.
    map.removeControl(loading);

    // everything here makes dialog appear when clicking icons
    // taken basically directly from maplibre docs
    // https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/
    map.on('click', 'clubs', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maplibregl.Popup({ className: "maplibre-popup" })
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the clubs layer.
    map.on('mouseenter', 'clubs', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'clubs', () => {
      map.getCanvas().style.cursor = '';
    });

  });
};

// Loading spinner taken from https://loading.io/css/
const styles = html`
  <link
    rel="stylesheet"
    href="https://unpkg.com/maplibre-gl@^5.6.0/dist/maplibre-gl.css"
    crossorigin=""
  />
  <style>
    #map {
      width: 100%;
      height: 100%;
    }
    .maplibre-popup {
      font-family: "Phantom Sans";
    }
    .clubs-loading {
      font-family: "Phantom Sans";
      padding: 4px;
      align-content: center;
      font-size: 16px;
      text-align:center;
    }
    .clubs-loading > div {
      display: inline-block;
      vertical-align: middle;
      margin-left: 6px;
    }

    .lds-dual-ring,
    .lds-dual-ring:after {
      box-sizing: border-box;
    }
    .lds-dual-ring {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 32px;
      height: 32px;
      margin: 4px;
      border-radius: 50%;
      border: 4px solid currentColor;
      border-color: currentColor transparent currentColor transparent;
      animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

  </style>
`;

const template = (host) => html`
  ${styles}
  <div id="map"></div>
`;

makeComponent({
  name: "club-map",
  template,
  onConstruct,
  onConnected,
});
