import express from "express";
import dotenv from "dotenv";
import { searchAddress, searchLatLong } from "./js/searchAddress.js";
import airtableHelperFactory from "./js/airtable.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get(`/clubs`, async function (req, res) {
	const { get } = airtableHelperFactory("Clubs Dashboard", "Main");

	try {
		const all = await get();
		const clubs = all
      .map(x => x.fields)
      .filter(({ Latitude, Longitude }) => Latitude && Longitude)
      .map( x => ({ 
      	Venue: x.Venue,
      	Latitude: x.Latitude, 
      	Longitude: x.Longitude 
      }))

	  res.send(clubs);
	} catch (err) {
		res.send(err);
	}

})

app.get('/address/:address', async function(req , res) {
	try {
		const result = await searchAddress(req.params.address);
		
  	res.send(result);
	} catch (err) {
		console.log(err);
	}

});

app.get('/latLong/:latLong', async function(req , res) {
	try {
		const result = await searchLatLong(req.params.latLong);
		
  	res.send(result);
	} catch (err) {
		console.log(err);
	}

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})