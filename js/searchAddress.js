import NodeGeocoder from "node-geocoder";
import Bottleneck from 'bottleneck';
import fetch from "node-fetch";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
})

// const factory = function() {
//     let time = 0, count = 0, difference = 0, queue = [];
//     return function limit(func) {
//         if (func) queue.push(func);
//         difference = 1000 - (window.performance.now() - time);
//         if (difference <= 0) {
//             time = window.performance.now();
//             count = 0;
//         }
//         if (++count <= 10) (queue.shift())();
//         else setTimeout(limit, difference);
//     };
// };

// const options = {
//   provider: 'openstreetmap',
//   // Optional depending on the providers
//   // fetch: customFetchImplementation,
//   // apiKey: process.env.GOOGLE_MAP_API, // for Mapquest, OpenCage, Google Premier
//   // formatter: "string" // 'gpx', 'string', ...
// };

// const geocoder = NodeGeocoder(options);
// export const searchAddress = async (address) => await geocoder.geocode(address);

// export const searchAddress = (...args) => limiter.schedule(() => searchAddressHelper(...args));

export const searchAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`
    const json = await fetch(url).then( res => res.json() );
    
    return json.results.length > 0 ? json.results[0] : [];
}

export const searchLatLong = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`
    const json = await fetch(url).then( res => res.json() );
    
    let lat = 0;
    let lng = 0;

    if (json.results.length > 0) {
        const loc = json.results[0].geometry.location
        lat = loc.lat;
        lng = loc.lng;
    }
    
    return [ lat, lng ];
}