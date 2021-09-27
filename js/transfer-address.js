import dotenv from "dotenv";
import airtableHelperFactory from "./airtable.js";

dotenv.config();

const sleep = m => new Promise(r => setTimeout(r, m))

const { get: getClubs, update } = airtableHelperFactory("Clubs Dashboard", "Main");
const { get: getApps } = airtableHelperFactory("Application Tracker", "Main");

let apps = await getApps();
apps = apps.map(x => [ x.id, x.fields ])
let clubs = await getClubs();
clubs = clubs.map(x => [ x.id, x.fields ])

let appsObj = {};
apps.forEach(([ id, fields ]) => {
	if (!fields["Venue"] || !fields["Location"] || (fields["Venue"] in appsObj)) return

	appsObj[fields["Venue"]] = fields["Location"];
})

clubs.forEach(([ id, fields ]) => {
	if (!fields["Location"] && (fields["Venue"] in appsObj)) {
		update({ id, fields: { Location: appsObj[fields["Venue"]] } })
	}
})

// console.log(apps);
// console.log(clubs);
console.log(clubs);

// for (const club of all) {
// 	// if app in clubs and no clubs address
// 	const locationString = club.fields["Location"];
// 	const address = (await searchAddress(locationString))[0];
// 	await sleep(1500);

// 	console.log(club, address);
// 	if (!address) continue;
// 	const { latitude: Latitude, longitude: Longitude } = address;
// 	update({ id: club.id, fields: { Latitude, Longitude } });
// }