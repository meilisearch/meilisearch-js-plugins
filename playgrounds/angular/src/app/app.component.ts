import { Component } from '@angular/core'
import { instantMeiliSearch } from '../../../../src'

const searchClient = instantMeiliSearch(
  'https://demo-steam.meilisearch.com/',
  '90b03f9c47d0f321afae5ae4c4e4f184f53372a2953ab77bca679ff447ecc15c'
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
