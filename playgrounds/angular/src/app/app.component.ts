import { Component } from '@angular/core'
import { instantMeiliSearch } from '../../../../src'

const searchClient = instantMeiliSearch(
  'https://integration-demos.meilisearch.com',
  'SEJe5jmM54f7afa09d0500b1fcc5bbeda8e4667453f5af2707c7fd62db6e4727701be0ae'
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
