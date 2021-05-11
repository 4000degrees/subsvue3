import {
  createApp
} from 'vue'
import App from './App.vue'
import store from './store'
import observer from './observer-directive'
import style from './style.css'
require("./temp-debug-stuff.js")

const app = createApp(App)
app.directive('observer', observer);
app.use(store)
app.mount('#app')

export default app
