import store from './store'

export default commands = [
  {
    name: "Play/pause",
    handler: () => {
      if (store.state.player.paused == true) {
        store.state.player.play();
      } else {
        store.state.player.pause();
      }
    }
  },
  {
    name: "Skip backward",
    handler: () => {
      store.state.player.currentTime -= seconds
    }
  },
]
