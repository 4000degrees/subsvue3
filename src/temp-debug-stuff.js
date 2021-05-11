import store from './store'
import app from './main'
window['store'] = store
window['app'] = app

window.currentSubtitleEl = () => {
  return document.querySelector(`[data-subtitle-id="${store.getters.currentSubtitle.id}"`)
}
