// commands: CommandManager.listCommands()
// scopes: "all" + CommandManager.scopes
// preventDefault is called unless otherwise specified
// example:
// {
//   hotkey: "alt+left",
//   scope: "all",
//   command: "skip-backward"
// ? preventDefault: true
// }

export default [

  {
    hotkey: "alt+left",
    scope: "all",
    command: "skip-backward"
  },
  {
    hotkey: "alt+right",
    scope: "all",
    command: "skip-forward"
  },
  {
    hotkey: "ctrl+space",
    scope: "all",
    command: "play"
  },
  {
    hotkey: "alt+d",
    scope: "all",
    command: "set-start"
  },
  {
    hotkey: "alt+e",
    scope: "all",
    command: "set-end"
  },
  {
    hotkey: "alt+h",
    scope: "all",
    command: "shift"
  },
  {
    hotkey: "alt+s",
    scope: "SolidEditor",
    command: "split"
  }

]
