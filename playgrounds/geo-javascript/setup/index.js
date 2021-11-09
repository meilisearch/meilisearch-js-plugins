const settings = require('./settings.json')
const cities = require('./world-cities.json')
const { MeiliSearch } = require('meilisearch')

const INDEX_UID = 'world_cities'
;(async () => {
  const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
  })
  try {
    await client.deleteIndex(INDEX_UID)
  } catch (e) {
    // world_cities does not exist
  }
  const settingsUpdate = await client.index(INDEX_UID).updateSettings(settings)
  const status = await client
    .index(INDEX_UID)
    .waitForPendingUpdate(settingsUpdate.updateId)
  if (status.status === 'processed') {
    console.log('SUCCESS: Settings have been succesfully added.')
  } else {
    console.warn(
      'WARN: Something went wrong during the settings addition process.',
      status
    )
  }
  const citiesUpdate = await client.index(INDEX_UID).addDocuments(cities)
  const documentAdditionStatus = await client
    .index(INDEX_UID)
    .waitForPendingUpdate(citiesUpdate.updateId, { timeOutMs: 10000 })
  if (documentAdditionStatus.status === 'processed') {
    console.log('SUCCESS: All documents have been succesfully indexed.')
  } else {
    console.warn(
      'WARN: Something went wrong in the documents addition process.'
    )
  }
})()
