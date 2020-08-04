import Vue from "vue";
import App from "./App.vue";
import InstantSearch from "vue-instantsearch";

Vue.use(InstantSearch);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
