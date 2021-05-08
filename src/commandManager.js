import commands from './commands'
import defaultHotkeys from './defaultHotkeys'
import hotkeys from 'hotkeys-js';
import store from './store'

const CommandManager = {

  init(refs) {
    this.setRefs(refs)

    hotkeys.filter = function(event) {
      return true;
    }

    store.watch(state => state.hotkeys, (n, o) => {
      this.bindHotkeys(n)
    }, {
      deep: true
    })

    this.bindHotkeys(store.state.hotkeys)
  },

  commands: commands.reduce((accumulator, current) => {
    accumulator[current.name] = current
    return accumulator
  }, {}),

  boundHotkeys: [],
  
  scopes: ["all"],

  setRefs(refs) {
    this.refs = refs
  },

  listCommands() {
    return Object.keys(this.commands)
  },

  exec(command) {
    this.commands[command].handler.call(this.refs)
  },

  unbindHotkeys() {
    hotkeys.unbind()
    this.boundHotkeys = []
  },

  hotkeyCommands(hotkey) {
    return this.boundHotkeys.filter(hk => hk.hotkey == hotkey).map(hk => hk.command)
  },

  registerScope(scope) {
    if (this.scopes.includes(scope)) {
      console.log(`Scope "${scope}" is already registered.`);
    } else {
      this.scopes.push(scope)
    }
  },

  deregisterScope(scope) {
    const index = this.scopes.indexOf(scope);
    if (index > -1) {
      this.scopes.splice(index, 1);
    }
  },

  setScope(scope) {
    if (this.scopes.includes(scope)) {
      hotkeys.setScope(scope)
    } else {
      console.log(`Scope "${scope}" is not registered.`);
    }
  },

  getScope() {
    return hotkeys.getScope()
  },

  bindHotkeys(hotkeyArray) {
    this.unbindHotkeys()
    hotkeyArray.forEach(item => {
      if (this.boundHotkeys.map(hk => hk.hotkey).includes(item.hotkey)) {
        console.log(`Hotkey ${item.hotkey} is already assigned to "${this.hotkeyCommands(item.hotkey).join(", ")}" within "${item.scope}" scope.`);
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


export default CommandManager
