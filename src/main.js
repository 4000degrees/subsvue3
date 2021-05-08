import {
  createApp
} from 'vue'
import App from './App.vue'
import store from './store'
import observer from './observerDirective'
import style from './style.css'


const app = createApp(App)
app.directive('observer', observer);
app.use(store)
window['store'] = store
window["app"] = app
app.mount('#app')
