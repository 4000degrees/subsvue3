import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import observer from './observerDirective'

import sampleData from "./sampleData.js"
import parser from "./subsFormatsParser"

import style from './style.css'
//
Vue.directive('observer', observer);
// Vue.use(observer)

window['store'] = store

// var sd = sampleData()
// parser(sd.data, sd.format)

var app = new Vue({
  el: '#app',
  template: '<App />',
  store,
  components: {
    App,
  },
})
