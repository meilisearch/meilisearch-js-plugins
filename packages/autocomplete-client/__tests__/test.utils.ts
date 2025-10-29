import { meilisearchAutocompleteClient } from '../src/index.js'
import { MeiliSearch } from 'meilisearch'

const dataset = [
  { id: 1, label: 'Hit 1' },
  { id: 2, label: 'Hit 2' },
]
const HOST = 'http://localhost:7700'
const API_KEY = 'masterKey'
const searchClient = meilisearchAutocompleteClient({
  url: HOST,
  apiKey: API_KEY,
})

const meilisearchClient = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'masterKey',
})

export const MOVIES = [
  {
    id: 2,
    title: 'Ariel',
    overview:
      "Taisto Kasurinen is a Finnish coal miner whose father has just committed suicide and who is framed for a crime he did not commit. In jail, he starts to dream about leaving the country and starting a new life. He escapes from prison but things don't go as planned...",
    genres: ['Drama', 'Crime', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/ojDg0PGvs6R9xYFodRct2kdI6wC.jpg',
    release_date: 593395200,
    reviews: [
      { id: 1, author: 'John', content: 'one star' },
      { id: 2, author: 'Jane', content: 'two stars' },
    ],
  },
  {
    id: 5,
    title: 'Four Rooms',
    overview:
      "It's Ted the Bellhop's first night on the job...and the hotel's very unusual guests are about to place him in some outrageous predicaments. It seems that this evening's room service is serving up one unbelievable happening after another.",
    genres: ['Crime', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/75aHn1NOYXh4M7L5shoeQ6NGykP.jpg',
    release_date: 818467200,
    reviews: [
      { id: 3, author: 'John', content: 'three stars' },
      { id: 4, author: 'Jane', content: 'four stars' },
    ],
  },
  {
    id: 6,
    title: 'Judgment Night',
    overview:
      'While racing to a boxing match, Frank, Mike, John and Rey get more than they bargained for. A wrong turn lands them directly in the path of Fallon, a vicious, wise-cracking drug lord. After accidentally witnessing Fallon murder a disloyal henchman, the four become his unwilling prey in a savage game of cat & mouse as they are mercilessly stalked through the urban jungle in this taut suspense drama',
    genres: ['Action', 'Thriller', 'Crime'],
    poster: 'https://image.tmdb.org/t/p/w500/rYFAvSPlQUCebayLcxyK79yvtvV.jpg',
    release_date: 750643200,
    reviews: [
      { id: 5, author: 'John', content: 'five stars' },
      { id: 6, author: 'Jane', content: 'six stars' },
    ],
  },
  {
    id: 11,
    title: 'Star Wars',
    overview:
      'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.',
    genres: ['Adventure', 'Action', 'Science Fiction'],
    poster: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    release_date: 233366400,
    reviews: [
      { id: 7, author: 'John', content: 'seven stars' },
      { id: 8, author: 'Jane', content: 'eight stars' },
    ],
  },
  {
    id: 30,
    title: 'Magnetic Rose',
    overview: '',
    genres: ['Animation', 'Science Fiction'],
    poster: 'https://image.tmdb.org/t/p/w500/gSuHDeWemA1menrwfMRChnSmMVN.jpg',
    release_date: 819676800,
    reviews: [
      { id: 9, author: 'John', content: 'nine stars' },
      { id: 10, author: 'Jane', content: 'ten stars' },
    ],
  },
  {
    id: 24,
    title: 'Kill Bill: Vol. 1',
    overview: null,
    genres: ['Action', 'Crime'],
    poster: 'https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg',
    release_date: 1065744000,
    reviews: [
      { id: 11, author: 'John', content: 'eleven stars' },
      { id: 12, author: 'Jane', content: 'twelve stars' },
    ],
  },
]

export { HOST, API_KEY, searchClient, dataset, meilisearchClient }
