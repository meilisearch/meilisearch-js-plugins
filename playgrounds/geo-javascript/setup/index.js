const settings = require('./settings.json')
const cities = require('./world-cities.json')
const { MeiliSearch } = require('meilisearch')

const INDEX_UID = 'cities_playground'
;(async () => {
  const client = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: 'masterKey',
  })
  try {
    await client.deleteIndex(INDEX_UID)
  } catch (e) {
    // cities_playground does not exist
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
  await client.index(INDEX_UID).waitForPendingUpdate(citiesUpdate.updateId)
  const documents = await client.index(INDEX_UID).getDocuments()
  if (documents.length === 20) {
    console.log('SUCCESS: All 20 documents have been succesfully indexed.')
  } else {
    console.warn(
      'WARN: Something went wrong in the documents addition process.'
    )
  }
})()
