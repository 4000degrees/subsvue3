<template>
<div id="SolidEditor" v-observer.childList="onChildListChange" @input="input" contenteditable="true">
  <SolidEditorSubtitle v-for="subtitle in subtitles" :key="subtitle.id" :subtitle="subtitle" />
</div>
</template>

<script>
import SolidEditorSubtitle from "./SolidEditorSubtitle.vue"
import {
  sanitizeEditorSpan,
  getTextSelectionWhithin
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
      /*
      when subtitle spans get deleted from editor,
      they are marked as deleted, other components get filtered
      list of undeleted subtitles, while this editor
      gets all, because otherwise it causes a change and ctrl+z stops working
      */
      return this.$store.getters.evenDeletedSubtitles
    },
    currentSubtitle() {
      return this.$store.state.currentSubtitle
    }
  },
  methods: {
    onChildListChange(mutationsList) {
      // Watch deletions of subtitles in the editor to delete them in the store
      for (const mutation of mutationsList) {
        if (mutation.removedNodes[0] && mutation.removedNodes[0].__vueParentComponent) {
          this.$store.commit("deleteSubtitle", mutation.removedNodes[0].__vueParentComponent.ctx.subtitle)
        } else if (mutation.addedNodes[0] && mutation.addedNodes[0].__vueParentComponent) {
          this.$store.commit("undeleteSubtitle", mutation.addedNodes[0].__vueParentComponent.ctx.subtitle)
        }
      }
    },
    input() {
      this.$store.commit("updateSubtitle", {
        obj: this.$store.state.currentSubtitle,
        text: this.selectedSubtitleElement.innerHTML
      })
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


    document.addEventListener("selectionchange", () => {

      var selectedSubtitle = window.getSelection().focusNode
      var isSubtitle = () => selectedSubtitle.dataset ? selectedSubtitle.dataset["subtitleId"] : false
      while (this.$el.contains(selectedSubtitle) && this.$el != selectedSubtitle && !isSubtitle() && selectedSubtitle != null) {
        selectedSubtitle = selectedSubtitle.parentNode
      }
      if (isSubtitle()) {
        this.selectedSubtitleElement = selectedSubtitle
        this.$store.commit("setCurrentSubtitle", selectedSubtitle.__vueParentComponent.ctx.subtitle)

        var text = this.$el.innerText
        var selection = getTextSelectionWhithin(this.selectedSubtitleElement)
        if (selection) {
          this.$store.state.currentSubtitleSelection = {
            text: text,
            ...selection,
            textBefore: text.substring(0, selection.start),
            textSelected: text.slice(selection.start, selection.end),
            textAfter: text.substring(selection.end, text.length)
          }
        } else {
          this.$store.state.currentSubtitleSelection = null
        }

      }
    })

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
  /* background: lightgray; */
  overflow-y: scroll;
  padding: 5px;
  box-sizing: border-box;
  /* will-change: contents; */
  /* white-space: pre; */
}
</style>
