import { searchAddress, searchLatLong } from "./searchAddress.js";
import airtableHelperFactory from "./airtable.js";

console.log("Adding clubs locations.");

const sleep = m => new Promise(r => setTimeout(r, m))

const { get, update } = airtableHelperFactory("Club Map", "Main");

const all = await get();

for (const club of all) {
	if (
		!club.fields["Location"] 
		|| club.fields["Location"] === "" 
		|| club.fields["venue_lat_fuzz"]
	) continue;
	const locationString = club.fields["Location"];
	const [ Latitude, Longitude ] = await searchLatLong(locationString);
	if (Latitude == 0 && Longitude == 0) continue;

	console.log("Updating", club.fields["Venue"]);

	update({ id: club.id, fields: { Latitude, Longitude } });
	await sleep(1000);
}
