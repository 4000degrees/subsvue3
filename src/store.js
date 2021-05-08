import VuexPersistence from 'vuex-persist'
import defaultHotkeys from './defaultHotkeys'

import {
  createStore
} from 'vuex'

import {
  uniqueID,
  getFileExtension,
  sec2ms,
  timeLengthMs
} from './misc'
import subsFormatsParser, {
  formatSupported
} from './subsFormatsParser'
import newSubtitle from './newSubtitle'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: "subs"
})

const state = {
  subtitles: [],
  currentSubtitle: {},
  projectOpened: false,
  settings: {},
  gridStackData: [{
    "dataRef": "button-container",
    "x": "4",
    "y": "0",
    "w": "1",
    "h": "17"
  }, {
    "dataRef": "player",
    "x": "0",
    "y": "0",
    "w": "4",
    "h": "17"
  }, {
    "dataRef": "solid-editor",
    "x": "5",
    "y": "0",
    "w": "4",
    "h": "17"
  }, {
    "dataRef": "single-subtitle-ce",
    "x": "9",
    "y": "0",
    "w": "3",
    "h": "6"
  }, {
    "dataRef": "subtitle-table",
    "x": "0",
    "y": "17",
    "w": "5",
    "h": "32"
  }],
  videoFollowsSubtitles: true,
  currentSubtitleSelection: null,
  hotkeys: defaultHotkeys
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
  },
  currentSubtitle(state) {
    return state.currentSubtitle
  },
  currentTime(state) {
    if (state.currentSubtitle) {
      return state.currentSubtitle.start
    } else {
      return 0
    }
  },
  currentSubtitleIndex(state) {
    return state.subtitles.indexOf(state.currentSubtitle)
  },
  previousSubtitle(state, getters) {
    return state.subtitles[getters.currentSubtitleIndex - 1]
  },
  nextSubtitle(state, getters) {
    return state.subtitles[getters.currentSubtitleIndex + 1]
  }
}


const actions = {
  newProject(context) {
    context.commit("removeProjectData")
  },
  insertAfterCurrent(context) {
    context.commit("insertSubtitleAt", {
      index: context.getters.currentSubtitleIndex + 1,
      subtitle: newSubtitle()
    })
  },
  pushSubtitle(context, data) {
    context.commit("pushSubtitle", newSubtitle({
      start: data.start,
      end: data.end,
      text: data.text
    }))
  },
  openSubtitlesFile(context, event) {
    var file = event.target.files[0];
    var extension = getFileExtension(file.name)
    if (!file) {
      return;
    }
    if (!formatSupported(extension)) {
      console.log("Unsupported");
      return;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      var contents = e.target.result;
      var subtitleArray = subsFormatsParser(contents, extension)
      context.commit("importSubtitles", subtitleArray)
    };
    reader.onerror = function() {
      console.log(reader.error);
    };
  },
};

const mutations = {
  removeProjectData(state) {
    state.subtitles = []
    state.currentSubtitle = {}
    state.currentTime = 0

  },
  setCurrentSubtitle(state, subtitle) {
    state.currentSubtitle = subtitle
  },
  setSubtitleElement(state, data) {
    data.obj.el = data.el
  },
  deleteSubtitle(state, subtitle) {
    subtitle.deleted = true
  },
  undeleteSubtitle(state, subtitle) {
    subtitle.deleted = false
  },
  insertSubtitleAt(state, data) {
    state.subtitles.splice(data.index, 0, data.subtitle)
  },
  pushSubtitle(state, subtitle) {
    state.subtitles.push(subtitle)
  },
  importSubtitles(state, subtitleArray) {
    state.subtitles = subtitleArray
  },
  updateSubtitle(state, data) {
    data.obj.text = data.text
  },
  updateGridStackData(state, data) {
    state.gridStackData = data
  },
  setPlayer(state, player) {
    state.player = player
  },
  setVideoFollows(state, data) {
    state.videoFollowsSubtitles = data
  }

};

export default createStore({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    vuexLocal.plugin
  ]
});