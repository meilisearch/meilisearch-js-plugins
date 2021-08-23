import { Component } from '@angular/core'
import { instantMeiliSearch } from '../../../../src'

const searchClient = instantMeiliSearch(
  'https://ms-4ff25e74c78d-106.saas.meili.dev',
  '31a66e0c590fdaa72b5fc78ee835644140c32b5e'
)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-app'
  config = {
    indexName: 'steam-video-games',
    searchClient,
  }
}
