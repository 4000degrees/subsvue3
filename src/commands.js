import {
  sec2ms,
  timeLengthMs
}
from './misc'

export default [

  {
    name: "play",
    description: "Play/pause",
    handler: function() {
      if (this.player.paused == true) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  },
  {
    name: "skip-backward",
    description: "Skip backward",
    handler: function(seconds = 0.3) {
      this.player.currentTime -= seconds
    }
  },
  {
    name: "skip-forward",
    description: "Skip backward",
    handler: function(seconds = 0.3) {
      this.player.currentTime += seconds
    }
  },
  {
    name: "set-start",
    description: "Set subtitle start time to video time",
    handler: function() {
      this.store.dispatch("updateCurrentSubtitleStart", {
        start: sec2ms(this.player.currentTime)
      })
    }
  },
  {
    name: "set-end",
    description: "Set subtitle end time to video time",
    handler: function() {
      this.store.dispatch("updateCurrentSubtitleEnd", {
        end: sec2ms(this.player.currentTime)
      })
    }
  },
  {
    name: "shift",
    description: "Shift start and end times to video time",
    handler: function() {
      let length = timeLengthMs(this.store.getters.currentSubtitle.start, this.store.getters.currentSubtitle.end)
      this.store.dispatch("updateCurrentSubtitleStart", {
        start: sec2ms(this.player.currentTime)
      })
      this.store.dispatch("updateCurrentSubtitleEnd", {
        end: sec2ms(this.player.currentTime) + length,
        appendUndoGroup: true
      })
    }
  },
  {
    name: "split",
    description: "Split subtitle at cursor position, setting new end and start times at video time",
    handler: function() {
      var selection = this.SolidEditor.getSelectionInSubtitle()

      this.store.commit("updateSubtitleText", {
        id: this.store.getters.currentSubtitle.id,
        text: selection.textBefore,
      })

      this.store.dispatch("addSubtitle", {
        subtitle: {
          text: selection.textAfter,
          start: this.player.currentTime + 1,
          end: this.store.getters.currentSubtitle.end
        },
        appendUndoGroup: true
      })

      this.store.commit("updateSubtitleEnd", {
        id: this.store.getters.currentSubtitle.id,
        end: this.player.currentTime,
        appendUndoGroup: true
      }, )

    }
  },
  {
    name: "undo",
    description: "Undo last action",
    handler: function() {
      if (this.store.state.done.length) {

        this.store.state.done[this.store.state.done.length - 1].forEach(entry => {
          if (entry.undoMutation.type == "updateSubtitleText") {
            this.store.state.undoing = true
            document.execCommand("undo")
            this.store.state.undoing = false
          }
        })

        this.store.dispatch("undo")
      }
    }
  },
  {
    name: "redo",
    description: "Redo last action",
    handler: function() {
      if (this.store.state.undone.length) {

        this.store.state.undone[this.store.state.undone.length - 1].forEach(entry => {
          if (entry.mutation.type == "updateSubtitleText") {
            this.store.state.undoing = true
            document.execCommand("redo")
            this.store.state.undoing = false
          }
        })

        this.store.dispatch("redo")
      }
    }
  }

]
