import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  subtitles: [],
  currentSubtitle: null,
  projectOpened: false,
  settings: {},
  editorElement: null
}

const getters = {
  currentSubtitleText(state) {
    let currentSubtitle = state.currentSubtitle || state.subtitles[0]
    return currentSubtitle.text || ""
  },
  subtitles(state) {
    return state.subtitles.filter((subtitle) => {
      return subtitle.deleted !== true
    })
  },
  evenDeletedSubtitles(state) {
    return state.subtitles
  }
}


const actions = {

};

var timeout = true;

const mutations = {
  setCurrentSubtitle(state, subtitle) {
    state.currentSubtitle = subtitle
  },
  setSubtitleElement(state, data) {
    data.obj.el = data.el
  },
  setEditorElement(state, el) {
    state.editorElement = el
  },
  deleteSubtitle(state, subtitle) {
    Vue.set(subtitle, "deleted", true)
  },
  undeleteSubtitle(state, subtitle) {
    Vue.set(subtitle, "deleted", false)
  },
  addSubtitle(state, data) {
    var subtitle;
    subtitle = {
      start: data.start,
      end: data.end,
      text: data.text,
    }
    state.subtitles.push(subtitle)
  },
  updateSubtitle(store, data) {
    if (timeout) {
      Vue.set(data.obj, "text", data.text)
      timeout = false;
      setTimeout(function () {
        timeout = true;
      }, 100);
    }
  }

};


export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
