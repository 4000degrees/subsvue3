import Vue from "vue";
import Vuex from "vuex";
import _ from 'lodash'
import {
  uniqueID
} from './misc.js'

Vue.use(Vuex);

const state = {
  projectData: Object.create(null),
  currentSubtitle: null,
  projectOpened: false,
  settings: {},
  editorElement: null
}

const getters = {
  currentSubtitleText(state) {
    return state.projectData[state.currentSubtitle.id].text
  },
  // getSubtitles(state) {
  //   Object.fromEntries(Object.entries(state.projectData).
  //   filter(([key, val]) => {
  //     console.log
  //     return true
  //   }));
  // }
}


const actions = {

};

var timeout = true;

const mutations = {
  loadProject(state, data) {
    state.projectData = data
  },
  updateCurrentSubtitleText(state, data) {
    state.projectData[state.currentSubtitle.id].text = state.currentSubtitle.innerHTML
  },
  updateSubtitleText(state, data) {
    state.projectData[data.id].text = data.text
  },
  setCurrentSubtitle(state, subtitle) {
    state.currentSubtitle = subtitle
  },
  setSubtitleElement(state, data) {
    data.obj.el = data.el
  },
  setEditorElement(state, el) {
    state.editorElement = el
  },
  deleteSubtitle(state, id) {
    // state.currentSubtitle = store.state.currentSubtitle.nextSibling
    Vue.delete(state.projectData, id)
  },
  addSubtitle(state, data) {
    var uniq = uniqueID(Object.keys(state.projectData));
    var subtitleData;
    subtitleData = {
      id: uniq,
      start: data.start,
      end: data.end,
      text: data.text,
    }
    Vue.set(state.projectData, uniq, subtitleData)
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
