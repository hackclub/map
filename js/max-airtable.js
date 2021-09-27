import Bottleneck from 'bottleneck'
import AirtablePlus from 'airtable-plus'

const limiter = new Bottleneck({
  maxConcurrent: 3,
  minTime: 500
})

const baseID = 'appSUAc40CDu6bDAp'

const get = async (table, options) => {
  const ts = Date.now()
  try {
    const airtable = new AirtablePlus({
      baseID,
      apiKey: process.env.AIRTABLE,
      tableName: table,
    })
    console.log(`[${ts}] Airtable GET '${table}' with the following options:`, options)
    const results = await airtable.read(options)
    console.log(`[${ts}] Found ${results.length} records(s)`)
    return results
  } catch (err) {
    console.log(`[${ts}]`, err)
  }
}

const find = async (table, options) => {
  if (typeof options === 'string') {
    if (options.startsWith('rec')) {
      options = {
        filterByFormula: `RECORD_ID()='${options}'`
      }
    } else {
      options = {
        filterByFormula: options
      }
    }
  }
  const results = await get(table, {...options, maxRecords: 1})
  return results[0]
}

const patch = async (table, recordID, fields) => {
  const ts = Date.now()
  try {
    console.log(`[${ts}] Airtable PATCH '${table} ID ${recordID}' with the following fields:`, fields)
    const airtable = new AirtablePlus({
      baseID,
      apiKey: process.env.AIRTABLE,
      tableName: table,
    })
    const result = await airtable.update(recordID, fields)
    console.log(`[${ts}] Airtable PATCH successful!`)
    return result
  } catch (err) {
    console.log(`[${ts}]`, err)
  }
}

const create = async (table, fields) => {
  const ts = Date.now()
  try {
    console.log(`[${ts}] Airtable CREATE '${table}' with the following fields:`, fields)
    const airtable = new AirtablePlus({
      baseID,
      apiKey: process.env.AIRTABLE,
      tableName: table,
    })
    const results = await airtable.create(fields)
    console.log(`[${ts}] Airtable created my record with these fields: ${{results}}`)
    return results
  } catch (err) {
    console.log(`[${ts}]`, err)
  }
}

export default {
  get: (...args) => limiter.schedule(() => get(...args)),
  find,
  patch: (...args) => limiter.schedule(() => patch(...args)),
  create: (...args) => limiter.schedule(() => create(...args)),
}