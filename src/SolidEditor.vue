<template>
<div id="SolidEditor" v-observer.childList="onChildListChange" contenteditable="true">
  <SolidEditorSubtitle v-for="(subtitle, index) in subtitles" v-bind:key="index" :subtitle="subtitle" />
  <span>Ooijosifjosidjf</span>
</div>
</template>

<script>
import SolidEditorSubtitle from "./SolidEditorSubtitle.vue"

export default {
  name: "SolidEditor",
  components: {
    SolidEditorSubtitle
  },
  props: {},
  data() {
    return {
      editorFocused: false
    }
  },
  computed: {
    subtitles() {
      return this.$store.getters.evenDeletedSubtitles
    },
    currentSubtitle() {
      return this.$store.state.currentSubtitle
    }
  },
  methods: {
    onChildListChange(mutationsList) {
      // Watch deletions of subtitles in the editor to delete them in the model
      for (const mutation of mutationsList) {
        if (mutation.removedNodes[0] && mutation.removedNodes[0].__vue__) {
          this.$store.commit("deleteSubtitle", mutation.removedNodes[0].__vue__.subtitle)
        } else if (mutation.addedNodes[0] && mutation.addedNodes[0].__vue__) {
          this.$store.commit("undeleteSubtitle", mutation.addedNodes[0].__vue__.subtitle)
        }
      }
    }
  },
  created() {},
  updated() {},
  mounted() {

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
        // if (window.getSelection().focusNode.parentElement === this.$el.lastChild) {
          // window.getSelection().focusNode.parentElement.appendChild(document.createElement("br"))
        // } else {
          if (window.getSelection().focusOffset == window.getSelection().focusNode.length || window.getSelection().focusNode.nodeType != 3) {
            document.execCommand('insertHTML', false, '<br><br>');
          } else {
            document.execCommand('insertHTML', false, '<br>');
          }
        // }
        return false;
      }
    }.bind(this))

  },
  watch: {}
};
</script>

<style scoped>
div {
  display: block;
  position: relative;
  width: 600px;
  height: 400px;
  background: lightgray;
  overflow: scroll;
  padding: 5px;
  /* will-change: contents; */
  white-space: pre;
}
</style>
