import VuexPersistence from 'vuex-persist'
import defaultHotkeys from './defaultHotkeys'
import defaultGridStackData from './defaultGridStackData'

import {
  createStore
} from 'vuex'

import {
  uniqueID,
  getFileExtension
} from './misc'
import subsFormatsParser, {
  formatSupported
} from './subsFormatsParser'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: "subs"
})

const state = {
  subtitles: {},
  currentSubtitle: null,
  projectOpened: false,
  gridStackData: defaultGridStackData,
  videoFollowsSubtitles: true,
  hotkeys: defaultHotkeys
}

const getters = {
  subtitles(state) {
    return Object.values(state.subtitles).filter((subtitle) => {
      return subtitle.deleted !== true
    })
  },
  evenDeletedSubtitles(state) {
    return state.subtitles
  },
  currentSubtitle(state) {
    return state.currentSubtitle || Object.values(state.subtitles)[0] || {
      id: null,
      text: "",
      start: 0,
      end: 0
    }
  },
  currentSubtitleText(state, getters) {
    return getters.currentSubtitle.text
  },
  currentSubtitleStart(state, getters) {
    return getters.currentSubtitle.start
  }
}


const actions = {
  newProject(context) {
    context.commit("removeProjectData")
    context.state.projectOpened = true
  },
  openSubtitlesFile(context, event) {
    var file = event.target.files[0];
    if (!file) {
      return;
    }
    var extension = getFileExtension(file.name)
    if (!formatSupported(extension)) {
      console.log("Unsupported");
      return;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      var contents = e.target.result;
      var parsedSubtitles = subsFormatsParser(contents, extension)
      context.dispatch("newProject")
      parsedSubtitles.forEach(subtitle => {
        context.commit("addSubtitle", {
          ...subtitle
        })
      })
    };
    reader.onerror = function() {
      console.log(reader.error);
    };
  },
  updateCurrentSubtitleText(context, text) {
    context.commit("updateSubtitleText", {
      id: context.getters.currentSubtitle.id,
      text
    })
  },
  updateCurrentSubtitleStart(context, start) {
    context.commit("updateSubtitleStart", {
      id: context.getters.currentSubtitle.id,
      start
    })
  },
  updateCurrentSubtitleEnd(context, end) {
    context.commit("updateSubtitleEnd", {
      id: context.getters.currentSubtitle.id,
      end
    })
  },
};

const mutations = {
  removeProjectData(state) {
    state.subtitles = {}
    state.currentSubtitle = null
  },
  importSubtitles(state, subtitles) {
    state.subtitles = subtitles
  },
  setCurrentSubtitle(state, id) {
    state.currentSubtitle = state.subtitles[id]
  },
  addSubtitle(state, payload) {
    var id = uniqueID()
    state.subtitles[id] = {
      id: id,
      text: "",
      start: 0,
      end: 0,
      ...payload
    }
  },
  updateSubtitle(state, payload) {
    state.subtitles[payload.id] = {
      ...state.subtitles[payload.id],
      ...payload
    }
  },
  updateSubtitleText(state, payload) {
    state.subtitles[payload.id].text = payload.text
  },
  updateSubtitleStart(state, payload) {
    state.subtitles[payload.id].start = payload.start
  },
  updateSubtitleEnd(state, payload) {
    state.subtitles[payload.id].end = payload.end
  },
  updateGridStackData(state, payload) {
    state.gridStackData = payload
  },
  deleteSubtitle(state, id) {
    if (!state.subtitles[id].deleted) {
      state.subtitles[id].deleted = true
    }
  },
  undeleteSubtitle(state, id) {
    if (state.subtitles[id].deleted) {
      state.subtitles[id].deleted = false
    }
  },
  setVideoFollows(state, payload) {
    state.videoFollowsSubtitles = payload
  }

};

const store = createStore({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    vuexLocal.plugin
  ]
})

export default store;
