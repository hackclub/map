import dotenv from "dotenv";
import airtableHelperFactory from "./airtable.js";

dotenv.config();

const sleep = m => new Promise(r => setTimeout(r, m))

const { get: getRaw } = airtableHelperFactory("Application Database", "Submitted");
const { get: getTracked, update } = airtableHelperFactory("Application Tracker", "Main");

let raw = await getRaw();
raw = raw.map(x => [ x.id, x.fields ])

let tracked = await getTracked();
tracked = tracked.map(x => [ x.id, x.fields ])

let rawObj = {};
raw.forEach(([ id, fields ]) => {
	if (fields["School Name"] in rawObj) return;

	const key = fields["School Name"];
	rawObj[key] = { 
		Location: fields["School Address"],
		"App ID": id
	};
})

console.log(rawObj)

tracked.forEach(([ id, fields ]) => {
	const key = fields["Venue"];

	if (!fields["Location"] && (key in rawObj)) {
		// console.log(fields);
		update({ id, fields: rawObj[key] })
	}
})