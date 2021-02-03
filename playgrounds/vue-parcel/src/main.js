import Vue from 'vue'
import App from './App.vue'
import InstantSearch from 'vue-instantsearch'

Vue.config.errorHandler = (error) => {
  console.log('ERROR!!')
  alert(error)
}
Vue.use(InstantSearch)
Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
