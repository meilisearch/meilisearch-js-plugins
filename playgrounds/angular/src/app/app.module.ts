import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgAisModule } from 'angular-instantsearch'

import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgAisModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
