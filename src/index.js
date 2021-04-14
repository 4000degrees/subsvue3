import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import observer from 'vue-mutation-observer'

import sampleData from "./sampleData.js"
import parser from "./subsFormatsParser"

Vue.use(observer)

window['store'] = store

var sd = sampleData()
parser(sd.data, sd.format)
// store.commit('loadProject', sampleData())

var app = new Vue({
  el: '#app',
  template: '<App />',
  store,
  components: {
    App,
  },
})
