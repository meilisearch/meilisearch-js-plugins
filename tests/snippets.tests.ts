import { searchClient, dataset, Movies } from './assets/utils'

describe('Snippet Browser test', () => {
  beforeAll(async () => {
    const deleteTask = await searchClient.MeiliSearchClient.deleteIndex(
      'movies'
    )
    await searchClient.MeiliSearchClient.waitForTask(deleteTask.uid)
    await searchClient.MeiliSearchClient.index(
      'movies'
    ).updateFilterableAttributes(['genres'])
    const documentsTask = await searchClient.MeiliSearchClient.index(
      'movies'
    ).addDocuments(dataset)
    await searchClient.MeiliSearchClient.index('movies').waitForTask(
      documentsTask.uid
    )
  })

  test('Test one attributesToSnippet on placeholder', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const snippeted = response.results[0]?.hits[0]?._snippetResult
    expect(snippeted).toHaveProperty('overview', { value: 'Princess...' })
  })

  test('Test one attributesToSnippet on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const highlighted = response.results[0]?.hits[0]?._highlightResult
    const snippeted = response.results[0].hits[0]._snippetResult

    expect(highlighted).toHaveProperty('overview', {
      value: 'While',
    })
    expect(snippeted).toHaveProperty('overview', {
      value: 'While...',
    })
  })

  test('Test * attributesToSnippet on specific query', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['*:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const highlighted = response.results[0]?.hits[0]?._highlightResult
    const snippeted = response.results[0].hits[0]._snippetResult

    expect(highlighted).toHaveProperty('id', {
      value: '6',
    })
    expect(snippeted).toHaveProperty('id', {
      value: '6',
    })
    expect(highlighted).toHaveProperty('title', {
      value: '__ais-highlight__Judg__/ais-highlight__ment Night',
    })
    expect(snippeted).toHaveProperty('title', {
      value: '__ais-highlight__Judg__/ais-highlight__ment Night',
    })
    expect(highlighted).toHaveProperty('overview', {
      value: 'While',
    })
    expect(snippeted).toHaveProperty('overview', {
      value: 'While...',
    })
    expect(highlighted).toHaveProperty('release_date', {
      value: '750643200',
    })
    expect(snippeted).toHaveProperty('release_date', {
      value: '750643200',
    })

    expect(highlighted?.genres).toBeTruthy()
    if (highlighted?.genres) {
      expect(highlighted?.genres[0].value).toEqual('Action')
      expect(highlighted?.genres[1].value).toEqual('Thriller')
      expect(highlighted?.genres[2].value).toEqual('Crime')
    }

    expect(snippeted?.genres).toBeTruthy()
    if (snippeted?.genres) {
      expect(snippeted?.genres[0].value).toEqual('Action')
      expect(snippeted?.genres[1].value).toEqual('Thriller')
      expect(snippeted?.genres[2].value).toEqual('Crime')
    }
  })

  test('Test two snippets on specific query and compare snippet with highlight results', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 's',
          attributesToSnippet: ['overview:2', 'title:2'],
          highlightPreTag: '<p>',
          highlightPostTag: '</p>',
          snippetEllipsisText: '...',
        },
      },
    ])

    const firstHitHighlight = response.results[0]?.hits[0]?._highlightResult
    const firstHitSnippet = response.results[0].hits[0]._snippetResult

    expect(firstHitHighlight).toHaveProperty('title', {
      value: '<p>S</p>tar Wars',
    })
    expect(firstHitHighlight).toHaveProperty('overview', {
      value: 'Luke <p>S</p>kywalker and',
    })

    expect(firstHitSnippet).toHaveProperty('title', {
      value: '<p>S</p>tar Wars',
    })
    expect(firstHitSnippet).toHaveProperty('overview', {
      value: 'Luke <p>S</p>kywalker and...',
    })

    const secondHitHighlight = response.results[0]?.hits[1]?._highlightResult
    const secondHitSnippet = response.results[0]?.hits[1]?._snippetResult
    expect(secondHitHighlight).toHaveProperty('title', { value: 'Four' })
    expect(secondHitHighlight?.overview?.value).toEqual("It'<p>s</p> Ted")

    expect(secondHitSnippet).toHaveProperty('title', {
      value: 'Four...',
    })
    expect(secondHitSnippet).toHaveProperty('overview', {
      value: "It'<p>s</p> Ted...",
    })
  })

  test('Test attributesToSnippet on a null attribute', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
        },
      },
    ])

    const firstHit = response.results[0]?.hits[0]?._snippetResult
    expect(firstHit).toHaveProperty('overview', { value: 'null' })
  })

  test('Test one attributesToSnippet on placeholder w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: '',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
        },
      },
    ])

    const snippeted = response.results[0]?.hits[0]?._snippetResult
    expect(snippeted).toHaveProperty('overview', { value: 'Princess...' })
    expect(snippeted).toHaveProperty('title', { value: 'Star Wars' })
  })

  test('Test one attributesToSnippet on specific query w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'judg',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const snippeted = response.results[0]?.hits[0]?._snippetResult
    expect(snippeted).toHaveProperty('overview', { value: 'While...' })
  })

  test('Test two attributesToSnippet on specific query with one hit empty string w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'm',
          attributesToSnippet: ['overview:2', 'title:5'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const firstHit = response.results[0]?.hits[0]?._snippetResult

    expect(firstHit).toHaveProperty('title', {
      value: '__ais-highlight__M__/ais-highlight__agnetic Rose',
    })
    expect(firstHit).toHaveProperty('overview', { value: '' })

    const secondHit = response.results[0].hits[1]._snippetResult
    expect(secondHit).toHaveProperty('title', {
      value: 'Judgment...',
    })
    expect(secondHit).toHaveProperty('overview', {
      value: 'boxing __ais-highlight__m__/ais-highlight__atch,...',
    })
  })

  test('Test attributesToSnippet on a null attribute w/ snippetEllipsisText', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Kill',
          attributesToSnippet: ['overview:2'],
          snippetEllipsisText: '...',
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

  test('Test attributes to snippet on non-string-types', async () => {
    const response = await searchClient.search<Movies>([
      {
        indexName: 'movies',
        params: {
          query: 'Jud',
          attributesToSnippet: ['*:2'],
          snippetEllipsisText: '...',
        },
      },
    ])
    const hit = response.results[0].hits[0]._snippetResult

    if (hit?.overview) {
      expect(hit?.overview.value).toEqual('While...')
    }
    if (hit?.poster) {
      expect(hit?.poster.value).toEqual('https...')
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
      // @ts-ignore
      expect(hit?.objectArray[0]?.value).toEqual('{"name":"charlotte"}')
      // @ts-ignore
      expect(hit?.objectArray[1]?.value).toEqual('{"name":"charlotte"}')
    }

    if (hit?.object) {
      // @ts-ignore
      expect(hit?.object?.value).toEqual('{"id":"1","name":"Nader"}')
    }

    if (hit?.nullField) {
      // @ts-ignore
      expect(hit?.nullField?.value).toEqual('null')
    }
  })
})

test('Test attributes to snippet on value smaller than the snippet size', async () => {
  const response = await searchClient.search<Movies>([
    {
      indexName: 'movies',
      params: {
        query: '',
        attributesToSnippet: ['*:20'],
        snippetEllipsisText: '...',
      },
    },
  ])
  const hit = response.results[0].hits[0]._snippetResult

  if (hit?.overview) {
    expect(hit?.title?.value).toEqual('Star Wars')
  }
})
