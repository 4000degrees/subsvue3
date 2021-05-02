import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from 'vuex-persist'
import {
  uniqueID,
  getFileExtension
} from './misc'
import subsFormatsParser, {
  formatSupported
} from './subsFormatsParser'
import newSubtitle from './newSubtitle'

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: "subs"
})




const state = {
  subtitles: [],
  currentSubtitle: {},
  projectOpened: false,
  settings: {},
  currentTime: 0,
  gridStackData: null
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
    return this.$store.state.currentSubtitle
  },
  currentTime(state) {
    if (state.currentSubtitle) {
      state.currentSubtitle.start
    } else {
      return 0
    }
  },
  currentSubtitleIndex(state) {
    return store.state.subtitles.indexOf(store.state.currentSubtitle)
  },
  previousSubtitle(state, getters) {
    return store.state.subtitles[getters.currentSubtitleIndex - 1]
  },
  nextSubtitle(state, getters) {
    return store.state.subtitles[getters.currentSubtitleIndex + 1]
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
  }
};

var updateSubtitleTimeout = true;

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
    Vue.set(subtitle, "deleted", true)
  },
  undeleteSubtitle(state, subtitle) {
    Vue.set(subtitle, "deleted", false)
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
    if (updateSubtitleTimeout) {
      Vue.set(data.obj, "text", data.text)
      updateSubtitleTimeout = false;
      setTimeout(function() {
        updateSubtitleTimeout = true;
      }, 100);
    }
  },
  setCurrentTime(state, data) {
    store.currentTime = data
  },
  updateGridStackData(state,data) {
    state.gridStackData = data
  }

};


export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    vuexLocal.plugin
  ]
});
