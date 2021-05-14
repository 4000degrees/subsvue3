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
  Object.keys(mutations).forEach(type => {
    if (Object.keys(undoMutations).includes(type)) {
      var originalMutation = mutations[type]
      var undoableMutation = function(state, payload) {
        var undoMutation = undoMutations[type](state, payload)
        if (!state.undoing) {
          var undoEntry = {
            mutation: {
              type: type,
              payload: payload
            },
            undoMutation: undoMutation
          }
          var undoGroup = [undoEntry]
          if ((payload.appendUndoGroup || store.state.appendUndoGroup) && state.done.length) {
            state.done[state.done.length - 1].push(undoEntry)
          } else {
            state.done.push(undoGroup)
          }
          state.undone = []
        }
        originalMutation(state, payload)
      }
      mutations[type] = undoableMutation
    }
  })
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
  "addSubtitle": (state, payload) => ({
    type: "removeSubtitle",
    payload: {
      id: payload.subtitle.id
    }
  }),
  "updateSubtitleStart": (state, payload) => ({
    type: "updateSubtitleStart",
    payload: {
      id: payload.id,
      start: state.subtitles[payload.id].start
    }
  }),
  "updateSubtitleEnd": (state, payload) => ({
    type: "updateSubtitleEnd",
    payload: {
      id: payload.id,
      end: state.subtitles[payload.id].end
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
    }).sort((a, b) => {
      return a.start - b.start
    })
  },
  evenDeletedSubtitles(state) {
    return Object.values(state.subtitles).sort((a, b) => {
      return a.start - b.start
    })
  },
  currentSubtitle(state) {
    return state.currentSubtitle || {
      start: 0,
      end: 0,
      text: ""
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
  addSubtitle(context, payload) {
    var id = uniqueID()
    var subtitle = {
      id: id,
      text: "",
      start: 0,
      end: 0,
      ...payload.subtitle
    }
    context.commit("addSubtitle", {
      ...payload,
      ...{
        subtitle
      }
    })
  },
  removeSubtitle(context, payload) {
    if (context.getters.currentSubtitle.id == payload.id) {
      context.dispatch("setNextSubtitleAsCurrent")
    }
    context.commit("removeSubtitle", payload)
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
        context.dispatch("addSubtitle", {
          subtitle: subtitle,
          appendUndoGroup: true
        })
      })
    };
    reader.onerror = function() {
      console.log(reader.error);
    };
  },
  updateCurrentSubtitleText(context, payload) {
    context.commit("updateSubtitleText", {
      id: context.getters.currentSubtitle.id,
      ...payload
    })
  },
  updateCurrentSubtitleStart(context, payload) {
    context.commit("updateSubtitleStart", {
      id: context.getters.currentSubtitle.id,
      ...payload
    })
  },
  updateCurrentSubtitleEnd(context, payload) {
    context.commit("updateSubtitleEnd", {
      id: context.getters.currentSubtitle.id,
      ...payload
    })
  },
  setNextSubtitleAsCurrent(context) {
    var currentIndex = context.getters.subtitles.indexOf(context.getters.currentSubtitle)
    var nextSubtitle = context.getters.subtitles[currentIndex + 1]
    if (nextSubtitle) {
      context.commit("setCurrentSubtitle", {id:nextSubtitle.id})
    } else {
      context.commit("setCurrentSubtitle", null)
    }
  },
  undo(context) {
    var done = context.state.done
    var undone = context.state.undone
    if (done.length) {
      context.state.undoing = true
      var lastDoneGroup = done[done.length - 1]
      lastDoneGroup.forEach(entry => {
        context.commit(entry.undoMutation.type, entry.undoMutation.payload)
      })
      undone.push(lastDoneGroup)
      done.splice(done.length - 1, 1)
      context.state.undoing = false
    }
  },
  redo(context) {
    var done = context.state.done
    var undone = context.state.undone
    if (undone.length) {
      context.state.undoing = true
      var lastUndoneGroup = undone[undone.length - 1]
      lastUndoneGroup.forEach(entry => {
        context.commit(entry.mutation.type, entry.mutation.payload)
      })
      done.push(lastUndoneGroup)
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
  setCurrentSubtitle(state, payload) {
    state.currentSubtitle = state.subtitles[payload.id]
  },
  addSubtitle(state, payload) {
    state.subtitles[payload.subtitle.id] = payload.subtitle
  },
  removeSubtitle(state, payload) {
    delete state.subtitles[payload.id]
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
    // vuexLocal.plugin,
  ]
})

export default store;
