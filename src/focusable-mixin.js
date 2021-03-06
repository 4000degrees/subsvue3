import CommandManager from './command-manager'


const focusable = {
  mounted() {
    CommandManager.registerScope(this.$options.name)
    this.$el.addEventListener('focus', this.focus, true)
    this.$el.addEventListener('blur', this.blur, true)
    this.$el.tabIndex = 0
  },
  beforeUnmount() {
    this.$el.removeEventListener('focusin', this.focus)
    this.$el.removeEventListener('blur', this.blur)
    CommandManager.deregisterScope(this.$options.name)
  },
  methods: {
    focus() {
      this.focused = true
      CommandManager.setScope(this.$options.name)
    },
    blur() {
      this.focused = false
      CommandManager.setScope("all")
    }
  }
}


export default focusable
