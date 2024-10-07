const { MeiliSearch } = require('meilisearch');

const HOST = 'http://localhost:7700';
const API_KEY = 'masterKey';

afterAll(async () => {
  try {
    const client = new MeiliSearch({ host: HOST, apiKey: API_KEY });
    await client.deleteIndex('movies');
    const task = await client.deleteIndex('games');

    await client.waitForTask(task.taskUid);
  } catch (error) {
    if ('cause' in error) {
      if ('message' in error.cause) {
        error.message += error.cause.message;
      } else {
        error.message += error.cause;
      }
    }

    throw error;
  }
});
