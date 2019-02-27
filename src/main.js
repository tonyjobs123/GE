import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from "vue-resource"
import App from './App.vue'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'
//boots
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// router setup
import routes from './routes/routes'
// plugin setup
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(LightBootstrap)
Vue.use(BootstrapVue)
//vue table
import { ClientTable } from 'vue-tables-2';
//
//changer la langue de vee-validate
Vue.use(ClientTable);
//vue validator
import VeeValidate, { Validator } from 'vee-validate';
//change the language of my vee-validate
import message  from 'vee-validate/dist/locale/fr';
//Validator.addLocale(messages)
/*const config={
  locale:'fr',
  dictionary:{
    fr:{attributes:attributesFr}
  }
}*/
//Validator.localize('fr')


Vue.use(VeeValidate,{locale:'fr',dictionary:{
  'fr':message}});

//vue-dialogue
//vue session
var options = {
  persist: true
}
import VueSession from 'vue-session'
Vue.use(VueSession,options)

//vue multi select
import Multiselect from 'vue-multiselect'
  Vue.component('multiselect', Multiselect)

// vue modal
import VModal from 'vue-js-modal'
Vue.use(VModal, {dynamic: true, injectModalsContainer: true})
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})
//statistique
//import VueCharts from 'vue-chartjs'
import { Bar, Line } from 'vue-chartjs'
//Vue.component('bar', Bar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
