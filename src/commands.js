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
      this.store.dispatch("updateCurrentSubtitleStart", sec2ms(this.player.currentTime))
    }
  },
  {
    name: "set-end",
    description: "Set subtitle end time to video time",
    handler: function() {
      this.store.dispatch("updateCurrentSubtitleEnd", sec2ms(this.player.currentTime))
    }
  },
  {
    name: "shift",
    description: "Shift start and end times to video time",
    handler: function() {
      let length = timeLengthMs(this.store.getters.currentSubtitle.start, this.store.getters.currentSubtitle.end)
      this.store.dispatch("updateCurrentSubtitleStart", sec2ms(this.player.currentTime))
      this.store.dispatch("updateCurrentSubtitleEnd", sec2ms(this.player.currentTime) + length)
    }
  },
  {
    name: "split",
    description: "Split subtitle at cursor position, setting new end and start times at video time",
    handler: function() {
      console.log("not implemented");
    }
  }

]
