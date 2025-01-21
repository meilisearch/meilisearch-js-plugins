import { createApp } from 'vue'
import App from './App.vue'
import InstantSearch from 'vue-instantsearch/vue3/es'
import 'instantsearch.css/themes/algolia-min.css'

createApp(App).use(InstantSearch).mount('#app')
