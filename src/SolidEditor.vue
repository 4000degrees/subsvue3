<template>
<div id="SolidEditor" v-observer.childList="onChildListChange" contenteditable="true">
  <SolidEditorSubtitle v-for="subtitle in subtitles" :key="subtitle.id" :subtitle="subtitle" />
</div>
</template>

<script>
import SolidEditorSubtitle from "./SolidEditorSubtitle.vue"
import {
  sanitizeEditorSpan
} from './misc'

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

    // Remove editor spans from pasted text so as not to interfere with editors work
    this.$el.addEventListener("paste", function(e) {
      e.preventDefault();
      var sanitizedData, pastedData;
      pastedData = (e.originalEvent || e).clipboardData.getData("text/html")
      sanitizedData = sanitizeEditorSpan(pastedData)
      document.execCommand("insertHTML", false, sanitizedData);
    });

    // prevent creating divs on enter
    this.$el.addEventListener("keypress", function keypress(event) {
      if (event.keyCode == 13) {
        event.preventDefault()


        if (window.getSelection().focusOffset == window.getSelection().focusNode.length || window.getSelection().focusNode.nodeType != 3) {
          document.execCommand('insertHTML', false, '&nbsp;');
          var sel = window.getSelection();
          var charCount = -1
          if (sel.rangeCount > 0) {
            var textNode = sel.focusNode;
            var newOffset = sel.focusOffset + charCount;
            sel.collapse(textNode, Math.min(textNode.length, newOffset));
          }
        } else {
          // document.execCommand('insertHTML', false, '<br>');

        }


        document.execCommand('insertHTML', false, '<br>');

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
  width: 100%;
  height: 100%;
  background: lightgray;
  overflow-y: scroll;
  padding: 5px;
  box-sizing: border-box;
  /* will-change: contents; */
  /* white-space: pre; */
}
</style>
