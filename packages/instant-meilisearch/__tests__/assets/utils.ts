import { instantMeiliSearch } from '../../src/index.js'
import { MeiliSearch } from 'meilisearch'

const HOST = 'http://localhost:7700'
const API_KEY = 'masterKey'

const dataset = [
  {
    id: 2,
    title: 'Ariel',
    overview:
      "Taisto Kasurinen is a Finnish coal miner whose father has just committed suicide and who is framed for a crime he did not commit. In jail, he starts to dream about leaving the country and starting a new life. He escapes from prison but things don't go as planned...",
    genres: ['Drama', 'Crime', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/ojDg0PGvs6R9xYFodRct2kdI6wC.jpg',
    release_date: 593395200,
    undefinedArray: [undefined, undefined, undefined],
    nullArray: [null, null, null],
    objectArray: [
      { name: 'hello world' },
      { name: 'hello world' },
      { name: 'hello world' },
    ],
    object: {
      id: 1,
      name: 'One two',
    },
    nullField: null,
    'crazy_\\_"field"': 'real \\"crazy"',
    numberField: 5,
  },
  {
    id: 5,
    title: 'Four Rooms',
    overview:
      "It's Ted the Bellhop's first night on the job...and the hotel's very unusual guests are about to place him in some outrageous predicaments. It seems that this evening's room service is serving up one unbelievable happening after another.",
    genres: ['Crime', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/75aHn1NOYXh4M7L5shoeQ6NGykP.jpg',
    release_date: 818467200,
    undefinedArray: [undefined, undefined, undefined],
    nullArray: [null, null, null],
    objectArray: [
      { name: 'hello world' },
      { name: 'hello world' },
      { name: 'hello world' },
    ],
    object: {
      id: 1,
      name: 'One two',
    },
    nullField: null,
    numberField: 10,
  },
  {
    id: 6,
    title: 'Judgment Night',
    overview:
      'While racing to a boxing match, Frank, Mike, John and Rey get more than they bargained for. A wrong turn lands them directly in the path of Fallon, a vicious, wise-cracking drug lord. After accidentally witnessing Fallon murder a disloyal henchman, the four become his unwilling prey in a savage game of cat & mouse as they are mercilessly stalked through the urban jungle in this taut suspense drama',
    genres: ['Action', 'Thriller', 'Crime'],
    poster: 'https://image.tmdb.org/t/p/w500/rYFAvSPlQUCebayLcxyK79yvtvV.jpg',
    release_date: 750643200,
    undefinedArray: [undefined, undefined, undefined],
    nullArray: [null, null, null],
    objectArray: [
      { name: 'hello world' },
      { name: 'hello world' },
      { name: 'hello world' },
    ],
    object: {
      id: 1,
      name: 'One two',
    },
    nullField: null,
    numberField: 15,
  },
  {
    id: 11,
    title: 'Star Wars',
    overview:
      'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.',
    genres: ['Adventure', 'Action', 'Science Fiction'],
    poster: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    release_date: 233366400,
  },
  {
    id: 30,
    title: 'Magnetic Rose',
    overview: '',
    genres: ['Animation', 'Science Fiction'],
    poster: 'https://image.tmdb.org/t/p/w500/gSuHDeWemA1menrwfMRChnSmMVN.jpg',
    release_date: 819676800,
  },
  {
    id: 24,
    title: 'Kill Bill: Vol. 1',
    overview: null,
    genres: ['Action', 'Crime'],
    poster: 'https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg',
    release_date: 1065744000,
  },
]

const geoDataset = [
  {
    id: '1',
    city: 'Lille',
    _geo: { lat: 50.629973371633746, lng: 3.056944739941957 },
    _geojson: { type: 'Point', coordinates: [3.056944739941957, 50.629973371633746] },
  },
  {
    id: '2',
    city: 'Mons-en-Barœul',
    _geo: { lat: 50.64158612012105, lng: 3.110659348034867 },
    _geojson: { type: 'Point', coordinates: [3.110659348034867, 50.64158612012105] },
  },
  {
    id: '3',
    city: 'Hellemmes',
    _geo: { lat: 50.63122096551808, lng: 3.1106399673339933 },
    _geojson: { type: 'Point', coordinates: [3.1106399673339933, 50.63122096551808] },
  },
  {
    id: '4',
    city: "Villeneuve-d'Ascq",
    _geo: { lat: 50.622468098014565, lng: 3.147642551343714 },
    _geojson: { type: 'Point', coordinates: [3.147642551343714, 50.622468098014565] },
  },
  {
    id: '5',
    city: 'Hem',
    _geo: { lat: 50.655250871381355, lng: 3.189729726624413 },
    _geojson: { type: 'Point', coordinates: [3.189729726624413, 50.655250871381355] },
  },
  {
    id: '6',
    city: 'Roubaix',
    _geo: { lat: 50.69247345189671, lng: 3.176332673774765 },
    _geojson: { type: 'Point', coordinates: [3.176332673774765, 50.69247345189671] },
  },
  {
    id: '7',
    city: 'Tourcoing',
    _geo: { lat: 50.72639746673648, lng: 3.154165365957867 },
    _geojson: { type: 'Point', coordinates: [3.154165365957867, 50.72639746673648] },
  },
  {
    id: '8',
    city: 'Mouscron',
    _geo: { lat: 50.74532555490861, lng: 3.2206407854429853 },
    _geojson: { type: 'Point', coordinates: [3.2206407854429853, 50.74532555490861] },
  },
  {
    id: '9',
    city: 'Tournai',
    _geo: { lat: 50.60534252860263, lng: 3.3758586941351414 },
    _geojson: { type: 'Point', coordinates: [3.3758586941351414, 50.60534252860263] },
  },
  {
    id: '10',
    city: 'Ghent',
    _geo: { lat: 51.053777403679035, lng: 3.695773311992693 },
    _geojson: { type: 'Point', coordinates: [3.695773311992693, 51.053777403679035] },
  },
  {
    id: '11',
    city: 'Brussels',
    _geo: { lat: 50.84664097454469, lng: 4.337066356428184 },
    _geojson: { type: 'Point', coordinates: [4.337066356428184, 50.84664097454469] },
  },
  {
    id: '12',
    city: 'Charleroi',
    _geo: { lat: 50.40957013888948, lng: 4.434735431508552 },
    _geojson: { type: 'Point', coordinates: [4.434735431508552, 50.40957013888948] },
  },
  {
    id: '13',
    city: 'Mons',
    _geo: { lat: 50.45029417885542, lng: 3.962372287090469 },
    _geojson: { type: 'Point', coordinates: [3.962372287090469, 50.45029417885542] },
  },
  {
    id: '14',
    city: 'Valenciennes',
    _geo: { lat: 50.351817774473545, lng: 3.53262836469288 },
    _geojson: { type: 'Point', coordinates: [3.53262836469288, 50.351817774473545] },
  },
  {
    id: '15',
    city: 'Arras',
    _geo: { lat: 50.28448752857995, lng: 2.763751584447816 },
    _geojson: { type: 'Point', coordinates: [2.763751584447816, 50.28448752857995] },
  },
  {
    id: '16',
    city: 'Cambrai',
    _geo: { lat: 50.1793405779067, lng: 3.218940995250293 },
    _geojson: { type: 'Point', coordinates: [3.218940995250293, 50.1793405779067] },
  },
  {
    id: '17',
    city: 'Bapaume',
    _geo: { lat: 50.1112761272364, lng: 2.854789466608312 },
    _geojson: { type: 'Point', coordinates: [2.854789466608312, 50.1112761272364] },
  },
  {
    id: '18',
    city: 'Amiens',
    _geo: { lat: 49.931472529669996, lng: 2.271049975831708 },
    _geojson: { type: 'Point', coordinates: [2.271049975831708, 49.931472529669996] },
  },
  {
    id: '19',
    city: 'Compiègne',
    _geo: { lat: 49.444980887725656, lng: 2.7913841281529015 },
    _geojson: { type: 'Point', coordinates: [2.7913841281529015, 49.444980887725656] },
  },
  {
    id: '20',
    city: 'Paris',
    _geo: { lat: 48.90210006089548, lng: 2.370840086740693 },
    _geojson: { type: 'Point', coordinates: [2.370840086740693, 48.90210006089548] },
  },
]

export type City = {
  id: string
  city: string
  _geo: { lat: number; lng: number }
  _geojson?: { type: 'Point'; coordinates: [number, number] }
}

export type Movies = {
  id?: number
  title?: string
  overview?: string
  poster?: string
  genres?: string[]
  release_date?: number
  undefinedArray?: undefined[]
  nullArray?: null[]
  objectArray?: Array<{ name: string }>
  object?: {
    id?: number
    name?: string
  }
  nullField?: null
  'crazy_\\_"field"'?: string
  numberField?: number
  _highlightResult?: Movies
}

const { searchClient } = instantMeiliSearch(
  'http://localhost:7700',
  'masterKey'
)
const { searchClient: wrongSearchClient } = instantMeiliSearch(
  'http://localhost:7777',
  'masterKey'
)
const meilisearchClient = new MeiliSearch({
  host: HOST,
  apiKey: API_KEY,
})

export {
  searchClient,
  dataset,
  wrongSearchClient,
  geoDataset,
  meilisearchClient,
  HOST,
  API_KEY,
}
