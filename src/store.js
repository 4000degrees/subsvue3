import VuexPersistence from 'vuex-persist'
import defaultHotkeys from './default-hotkeys'
import defaultGridStackData from './default-gridstack-data'

import {
  createStore
} from 'vuex'

import {
  uniqueID,
  getFileExtension
} from './misc'
import subsFormatsParser, {
  formatSupported
} from './subtitle-formats-parser'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: "subs",
  reducer: state => ({
    subtitles: state.subtitles,
    currentSubtitle: state.currentSubtitle,
    projectOpened: state.projectOpened,
    gridStackData: state.gridStackData,
    videoFollowsSubtitles: state.videoFollowsSubtitles,
    hotkeys: state.hotkeys,
  })
})


function makeMutationsUndoable(mutations) {
  for (var property in mutations) {
    if (Object.keys(undoMutations).includes(property)) {
      var type = property
      var originalMutation = mutations[type]
      var undoableMutation = function(state, payload) {
        var undoMutation = undoMutations[type](state, payload)
        if (!state.undoing) {
          state.done.push({
            mutation: {
              type: type,
              payload: payload
            },
            undoMutation: undoMutation
          })
          state.undone = []
        }
        originalMutation(state, payload)
      }
      mutations[type] = undoableMutation
    }
  }
  return {
    mutations
  }
}

const undoMutations = {
  "updateSubtitleText": (state, payload) => ({
    type: "updateSubtitleText",
    payload: {
      id: payload.id,
      text: state.subtitles[payload.id].text
    }
  }),
}


const state = {
  subtitles: {},
  currentSubtitle: null,
  projectOpened: false,
  gridStackData: defaultGridStackData,
  videoFollowsSubtitles: true,
  hotkeys: defaultHotkeys,
  done: [],
  undone: [],
  undoing: false
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
    return state.currentSubtitle
  },
  currentSubtitleText(state, getters) {
    return state.currentSubtitle ? state.subtitles[state.currentSubtitle].text : ""
  },
  currentSubtitleStart(state, getters) {
    return state.currentSubtitle ? state.subtitles[state.currentSubtitle].start : 0
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
      id: context.getters.currentSubtitle,
      text
    })
  },
  updateCurrentSubtitleStart(context, start) {
    context.commit("updateSubtitleStart", {
      id: context.getters.currentSubtitle,
      start
    })
  },
  updateCurrentSubtitleEnd(context, end) {
    context.commit("updateSubtitleEnd", {
      id: context.getters.currentSubtitle,
      end
    })
  },
  undo(context) {
    var done = context.state.done
    var undone = context.state.undone
    if (done.length) {
      context.state.undoing = true
      var lastDone = done[done.length - 1]
      context.commit(lastDone.undoMutation.type, lastDone.undoMutation.payload)
      undone.push(lastDone)
      done.splice(done.length - 1, 1)
      context.state.undoing = false
    }
  },
  redo(context) {
    var done = context.state.done
    var undone = context.state.undone
    if (undone.length) {
      context.state.undoing = true
      var lastUndone = undone[undone.length - 1]
      context.commit(lastUndone.mutation.type, lastUndone.mutation.payload)
      done.push(lastUndone)
      undone.splice(undone.length - 1, 1)
      context.state.undoing = false
    }
  },
  clearUndoRedo(context) {
    context.state.done = []
    context.state.undone = []
  }
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
    state.currentSubtitle = id
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
  ...makeMutationsUndoable(mutations),
  plugins: [
    vuexLocal.plugin,
  ]
})

export default store;
