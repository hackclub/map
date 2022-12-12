import "./SECRETS.js";
import { searchAddress, searchLatLong } from "./searchAddress.js";
import airtableHelperFactory from "./airtable.js";

const sleep = m => new Promise(r => setTimeout(r, m))

const { get, update } = airtableHelperFactory("Clubs Dashboard", "Main");

const all = await get();

for (const club of all) {
	if (!club.fields["Location"] || club.fields["Location"] === "" || club.fields["Latitude"]) continue;
	const locationString = club.fields["Location"];
	const [ Latitude, Longitude ] = await searchLatLong(locationString);
	if (Latitude == 0 && Longitude == 0) continue;

	console.log("Updating", club.fields["Venue"]);

	update({ id: club.id, fields: { Latitude, Longitude } });
	await sleep(1000);
}