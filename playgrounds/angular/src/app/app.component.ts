import { Component } from '@angular/core'
import { instantMeiliSearch } from '../../../../src'

const searchClient = instantMeiliSearch(
  'https://integration-demos.meilisearch.com',
  'q7QHwGiX841a509c8b05ef29e55f2d94c02c00635f729ccf097a734cbdf7961530f47c47'
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
