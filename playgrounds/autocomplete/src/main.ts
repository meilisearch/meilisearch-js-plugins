import './style.css'
import { setupAutocomplete } from './app.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="autocomplete"></div>
  </div>
`

setupAutocomplete(document.querySelector<HTMLButtonElement>('#autocomplete')!)
