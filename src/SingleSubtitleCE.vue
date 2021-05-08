

<template>
<div contenteditable @input="input"></div>
</template>

<script>
import CommandManager from './commandManager'
import focusable from './focusableMixin'
export default {
  name: "SingleSubtitleCE",
  mixins: [focusable],
  components: {},
  data() {
    return {};
  },
  computed: {
    text: {
      get() {
        return this.$store.getters.currentSubtitleText
      },
      set(text) {
        this.$store.commit("updateCurrentSubtitleText", text)
      }
    }
  },
  watch: {
    text(newValue) {
      if (!this.focused) {
        this.$el.innerHTML = newValue
      }
    },
  },
  methods: {
    input() {
      this.text = this.$el.innerHTML
    }
  },
  mounted() {
    this.$el.innerHTML = this.text
    // Prevent pasting html into the editor. Otherwise subtitle markup gets pasted.
    this.$el.addEventListener("paste", function(e) {
      e.preventDefault();
      var text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand("insertHTML", false, text);
    });

    // prevent creating divs on enter
    this.$el.addEventListener("keypress", function keypress(event) {
      if (event.keyCode == 13) {
        event.preventDefault()
        if (window.getSelection().focusOffset == window.getSelection().focusNode.length || window.getSelection().focusNode.nodeType != 3) {
          document.execCommand('insertHTML', false, '<br><br>');
        } else {
          document.execCommand('insertHTML', false, '<br>');
        }
        return false;
      }
    })

  },
}
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
  padding: 10px;
  /* border: 2px solid grey; */
  box-sizing: border-box;
  /* margin: 10px; */
  /* important */
  /* white-space: pre; */
  /*  */
}
</style>
