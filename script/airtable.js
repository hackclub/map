import Bottleneck from 'bottleneck';
import Airtable from "airtable";

if (typeof secrets !== 'undefined') {
  await import("./SECRETS.js");
}

const limiter = new Bottleneck({
  maxConcurrent: 3,
  minTime: 500
})

const base = await new Airtable({ apiKey: secrets.AIRTABLE }).base(secrets.baseID);

export default function airtableHelperFactory(table, view) {
  const get = async (search = "") => {
    // const ts = Date.now()
    try {
      // console.log(`[${ts}] Airtable GET '${table}' with the following search:`, search)

      const options = search === "" 
        ? { view }
        : { view, filterByFormula: search.startsWith("rec") ? `RECORD_ID()='${search}'` : search }

      const results = await base(table).select(options).all();

      // console.log(`[${ts}] Found ${results.length} records(s)`)

      return results;
    } catch (err) {
      // console.log(`[${ts}]`, err)
      console.log(err);
    }
  }

  const update = async (entries) => {
    // entries template
    // [
    //   {
    //     id: "rec",
    //     fields: {}
    //   }
    // ]
    try {
      return await base(table).update(Array.isArray(entries) ? entries : [ entries ]);
    } catch (err) {
      console.log(err);
    }

  }

  const create = async (fields) => {
    try {
      return await base(table).create(fields);
    } catch (err) {
      console.log(err);
    }
  }



  return { 
    get: (...args) => limiter.schedule(() => get(...args)),
    update: (...args) => limiter.schedule(() => update(...args)),
    create: (...args) => limiter.schedule(() => create(...args)),
    base  
  };
}
