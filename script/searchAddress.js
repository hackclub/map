import Bottleneck from 'bottleneck';
import fetch from "node-fetch";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
})

export const searchAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${secrets.GOOGLE_MAP_API}`
    const json = await fetch(url).then( res => res.json() );
    
    return json.results.length > 0 ? json.results[0] : [];
}

export const searchLatLong = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${secrets.GOOGLE_MAP_API}`
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