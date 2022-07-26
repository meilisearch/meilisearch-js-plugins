import {
  searchClient,
  dataset,
  Movies,
  meilisearchClient,
} from './assets/utils'

describe('Snippet Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await meilisearchClient.deleteIndex('movies')
    await meilisearchClient.waitForTask(deleteTask.taskUid)
    await meilisearchClient
      .index('movies')
      .updateFilterableAttributes(['genres'])
    const documentsTask = await meilisearchClient
      .index('movies')
      .addDocuments(dataset)
    await meilisearchClient.index('movies').waitForTask(documentsTask.taskUid)
  })

  test('Test one attributesToSnippet on placeholder without a snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
        },
      },
    ])
    const snippeted = response.results[0]?.hits[0]?._snippetResult

    // Default cropMarker `...` value is used
    expect(snippeted).toHaveProperty('overview', {
      value: 'Taisto Kasurinen…',
    })
  })

  test('Test one attributesToSnippet on placeholder with empty string snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '',
        },
      },
    ])
    const snippeted = response.results[0]?.hits[0]?._snippetResult

    expect(snippeted).toHaveProperty('overview', {
      value: 'Taisto Kasurinen',
    })
  })

  test('one attributesToSnippet on placeholder', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '…',
        },
      },
    ])

    const snippeted = response.results[0]?.hits[0]?._snippetResult

    expect(snippeted).toHaveProperty('overview', {
      value: 'Taisto Kasurinen…',
    })
  })

  test('one attributesToSnippet on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '…',
        },
      },
    ])

    const snippeted = response.results[0].hits[0]._snippetResult

    expect(snippeted).toHaveProperty('overview', {
      value: 'While racing…',
    })
  })

  test('* attributesToSnippet on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['*:2'],
          snippetEllipsisText: '…',
        },
      },
    ])
    const snippeted = response.results[0].hits[0]._snippetResult

    expect(snippeted).toHaveProperty('id', {
      value: '6',
    })

    expect(snippeted).toHaveProperty('title', {
      value: '__ais-highlight__Judg__/ais-highlight__ment Night',
    })

    expect(snippeted).toHaveProperty('overview', {
      value: 'While racing…',
    })

    expect(snippeted).toHaveProperty('release_date', {
      value: '750643200',
    })

    expect(snippeted?.genres).toBeTruthy()
    if (snippeted?.genres) {
      expect(snippeted?.genres[0].value).toEqual('Action')
      expect(snippeted?.genres[1].value).toEqual('Thriller')
      expect(snippeted?.genres[2].value).toEqual('Crime')
    }
  })

  test('two snippets on specific query and compare snippet with highlight results', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 's',
          attributesToSnippet: ['overview:2', 'title:1'],
          highlightPreTag: '<p>',
          highlightPostTag: '</p>',
          snippetEllipsisText: '…',
        },
      },
    ])

    const firstHitSnippet = response.results[0].hits[0]._snippetResult
    const secondHitSnippet = response.results[0]?.hits[1]?._snippetResult

    expect(firstHitSnippet).toHaveProperty('title', {
      value: '<p>S</p>tar…',
    })
    expect(firstHitSnippet).toHaveProperty('overview', {
      value: '…Luke <p>S</p>kywalker…',
    })
    expect(secondHitSnippet).toHaveProperty('title', {
      value: 'Four…',
    })
    expect(secondHitSnippet).toHaveProperty('overview', {
      value: "It'<p>s</p>…",
    })
  })

  test('attributesToSnippet on a null attribute', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '…',
        },
      },
    ])

    const firstHit = response.results[0]?.hits[0]?._snippetResult
    expect(firstHit).toHaveProperty('overview', { value: 'null' })
  })

  test('one attributesToSnippet on placeholder w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '…',
        },
      },
    ])

    const snippeted = response.results[0]?.hits[0]?._snippetResult

    expect(snippeted).toHaveProperty('overview', { value: 'Taisto Kasurinen…' })
  })

  test('one attributesToSnippet on specific query w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '…',
        },
      },
    ])

    const snippeted = response.results[0]?.hits[0]?._snippetResult
    expect(snippeted).toHaveProperty('overview', { value: 'While racing…' })
  })

  test('two attributesToSnippet on specific query with one hit empty string w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'm',
          attributesToSnippet: ['overview:1', 'title:1'],
          snippetEllipsisText: '…',
        },
      },
    ])

    const firstHit = response.results[0]?.hits[0]?._snippetResult
    expect(firstHit).toHaveProperty('title', {
      value: '__ais-highlight__M__/ais-highlight__agnetic…',
    })
    expect(firstHit).toHaveProperty('overview', { value: '' })

    const secondHit = response.results[0].hits[1]._snippetResult
    expect(secondHit).toHaveProperty('title', {
      value: 'Judgment…',
    })
    expect(secondHit).toHaveProperty('overview', {
      value: '…__ais-highlight__m__/ais-highlight__atch…',
    })
  })

  test('attributesToSnippet on a null attribute w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '…',
        },
      },
    ])
    const firstHit = response.results[0]?.hits[0]?._snippetResult

    expect(firstHit).toHaveProperty('overview', { value: 'null' })
    expect(firstHit).toHaveProperty('id', {
      value: '24',
    })
    expect(firstHit).toHaveProperty('title', {
      value: '__ais-highlight__Kill__/ais-highlight__ Bill: Vol. 1',
    })
  })

  test('attributes to snippet on non-string-types', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Judgment',
          attributesToSnippet: ['*:1'],
          snippetEllipsisText: '…',
        },
      },
    ])

    const hit = response.results[0].hits[0]._snippetResult
    if (hit?.overview) {
      expect(hit?.overview.value).toEqual('While…')
    }

    if (hit?.poster) {
      // Considered to be 2 words because of special char
      expect(hit?.poster.value).toEqual('https…')
    }

    if (hit?.genres) {
      expect(hit?.genres[0]?.value).toEqual('Action')
      expect(hit?.genres[1]?.value).toEqual('Thriller')
    }

    if (hit?.id) {
      expect(hit?.id.value).toEqual('6')
    }

    if (hit?.undefinedArray) {
      // @ts-ignore
      expect(hit?.undefinedArray[0]?.value).toEqual('null')
      // @ts-ignore
      expect(hit?.undefinedArray[1]?.value).toEqual('null')
    }

    if (hit?.nullArray) {
      // @ts-ignore
      expect(hit?.nullArray[0]?.value).toEqual('null')
      // @ts-ignore
      expect(hit?.nullArray[1]?.value).toEqual('null')
    }

    if (hit?.objectArray) {
      expect(hit?.objectArray[0]?.name?.value).toEqual('hello…')
      expect(hit?.objectArray[1]?.name?.value).toEqual('hello…')
    }

    if (hit?.object) {
      expect(hit?.object?.name?.value).toEqual('One…')
      expect(hit?.object?.id?.value).toEqual('1')
    }

    if (hit?.nullField) {
      // @ts-ignore
      expect(hit?.nullField?.value).toEqual('null')
    }
  })

  test('Test custom crop marker', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Judgment',
          attributesToSnippet: ['*:1'],
          snippetEllipsisText: '( •_•)',
        },
      },
    ])
    const hit = response.results[0].hits[0]._snippetResult

    if (hit?.overview) {
      expect(hit?.overview.value).toEqual('While( •_•)')
    }
    if (hit?.poster) {
      // Considered to be 2 words because of special char
      expect(hit?.poster.value).toEqual('https( •_•)')
    }

    if (hit?.genres) {
      expect(hit?.genres[0]?.value).toEqual('Action')
      expect(hit?.genres[1]?.value).toEqual('Thriller')
    }
    if (hit?.id) {
      expect(hit?.id.value).toEqual('6')
    }
    if (hit?.undefinedArray) {
      // @ts-ignore
      expect(hit?.undefinedArray[0]?.value).toEqual('null')
      // @ts-ignore
      expect(hit?.undefinedArray[1]?.value).toEqual('null')
    }

    if (hit?.nullArray) {
      // @ts-ignore
      expect(hit?.nullArray[0]?.value).toEqual('null')
      // @ts-ignore
      expect(hit?.nullArray[1]?.value).toEqual('null')
    }

    if (hit?.objectArray) {
      expect(hit?.objectArray[0]?.name?.value).toEqual('hello( •_•)')
      expect(hit?.objectArray[1]?.name?.value).toEqual('hello( •_•)')
    }

    if (hit?.object) {
      expect(hit?.object?.id?.value).toEqual('1')
      expect(hit?.object?.name?.value).toEqual('One( •_•)')
    }

    if (hit?.nullField) {
      // @ts-ignore
      expect(hit?.nullField?.value).toEqual('null')
    }
  })
})

test('attributes to snippet on value smaller than the snippet size', async () => {
  const response = await searchClient.search<Movies>([
    {
      indexName: 'movies',
      params: {
        query: '',
        attributesToSnippet: ['*:20'],
        snippetEllipsisText: '…',
      },
    },
  ])

  const hit = response.results[0].hits[0]._snippetResult
  if (hit?.overview) {
    expect(hit?.title?.value).toEqual('Ariel')
  }
})
