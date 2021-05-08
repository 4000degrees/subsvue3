import hotkeys from 'hotkeys-js'; //
import store from './store'
hotkeys.filter = function(event) {
  return true;
}
hotkeys('alt+left', function(event, handler) {
  event.preventDefault()
  store.dispatch("skipBackward")
});
hotkeys('alt+right', function(event, handler) {
  event.preventDefault()
  store.dispatch("skipForward")
});
hotkeys('ctrl+space', function(event, handler) {
  event.preventDefault()
  store.dispatch("playPause")
});
hotkeys('alt+d', function(event, handler) {
  event.preventDefault()
  store.dispatch("setStartTimeToVideo")
  console.log("alt d")
});
hotkeys('alt+e', function(event, handler) {
  event.preventDefault()
  store.dispatch("setEndTimeToVideo")
});
hotkeys('alt+h', function(event, handler) {
  event.preventDefault()
  store.dispatch("shiftStartAndEndToVideo")
});
hotkeys('alt+s', function(event, handler) {
  event.preventDefault()
  store.dispatch("splitAtVideoTime")
});

var defaulthotkeys = [{
  hotkey: "alt+left",
  command: "skip-backward"
}, {
  hotkey: "alt+right",
  command: "skip-forward"
}, {
  hotkey: "ctrl+space",
  command: "play"
}, {
  hotkey: "alt+d",
  command: "set-start"
}, {
  hotkey: "alt+e",
  command: "set-end"
}, {
  hotkey: "alt+h",
  command: "shift"
}, {
  hotkey: "alt+s",
  command: "split"
}]