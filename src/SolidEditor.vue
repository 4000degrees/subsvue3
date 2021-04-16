<template>
<div id="SolidEditor" v-observer.childList="onChildListChange" contenteditable="true">
  <SolidEditorSubtitle v-for="(subtitle, index) in subtitles" :subtitle="subtitle"/>
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
    onChildListChange(mutationsList, observer) {
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
    this.$store.commit("setEditorElement", this.$el)

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
        document.execCommand('insertHTML', false, '<br>');
        return false;
      }
    }, )

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
  /* will-change: contents; */
}
</style>
