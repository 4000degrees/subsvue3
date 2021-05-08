import commands from './commands'
import defaultHotkeys from './defaultHotkeys'
import hotkeys from 'hotkeys-js';
import store from './store'
window["hotkeys"] = hotkeys
hotkeys.filter = function(event) {
  return true;
}
export default class CommandManager {

  constructor(refs) {
    this.commands = {}
    commands.forEach((command) => {
      this.commands[command.name] = command
    });

    this.refs = refs

    store.watch(state => state.hotkeys, (n, o) => {
      this.bindHotkeys(n)
    }, {
      deep: true
    })

    this.boundHotkeys = []
    this.scopes = []

    this.bindHotkeys(store.state.hotkeys)
  }

  listCommands() {
    return Object.keys(this.commands)
  }

  exec(command) {
    this.commands[command].handler.call(this.refs)
  }

  unbindHotkeys() {
    hotkeys.unbind()
    this.boundHotkeys = []
  }

  hotkeyCommands(hotkey) {
    return this.boundHotkeys.filter(hk => hk.hotkey == hotkey).map(hk => hk.command)
  }

  bindHotkeys(hotkeyArray) {
    this.unbindHotkeys()
    hotkeyArray.forEach(item => {
      if (this.boundHotkeys.map(hk => hk.hotkey).includes(item.hotkey)) {
        console.log(`Hotkey ${item.hotkey} is already assigned to "${this.hotkeyCommands(item.hotkey).join(", ")}".`);
      }
      hotkeys(item.hotkey, item.scope, function(event, handler) {
        if (item.preventDefault !== false) {
          event.preventDefault()
        }
        this.exec(item.command)
      }.bind(this))
      this.boundHotkeys.push(item)
    });
  }
}
