<template>
<div id="SolidEditor" v-observer.childList="onChildListChange" @input="input" @keypress="keypress" @paste="paste" contenteditable="true">
  <SolidEditorSubtitle v-for="(subtitle, index) in subtitles" :key="subtitle.id" :index="index" />
</div>
</template>

<script>
import SolidEditorSubtitle from "./SolidEditorSubtitle.vue"
import {
  sanitizeEditorSpan,
  getSelectionStart,
  getSelectionEnd
} from '../misc'

import focusable from '../focusable-mixin'

import {
  mapGetters
} from 'vuex'

export default {
  name: "SolidEditor",
  mixins: [focusable],
  components: {
    SolidEditorSubtitle
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      /* when subtitle spans get deleted from editor, they are marked as deleted, other components get a filtered
      list of undeleted subtitles, while this editor gets all, because otherwise it causes a change and ctrl+z stops working */
      subtitles: "evenDeletedSubtitles"
    })
  },
  methods: {
    onChildListChange(mutationsList) {
      // Watch deletions of subtitles in the editor to mark them as deleted in the store
      var appendUndoGroup = false
      for (const mutation of mutationsList) {
        if (mutation.removedNodes[0] && mutation.removedNodes[0].dataset["subtitleId"]) {
          this.$store.commit("markAsDeleted", {
            id: mutation.removedNodes[0].dataset["subtitleId"],
            // appendUndoGroup
          })
        }
        else if (mutation.addedNodes[0] && mutation.addedNodes[0].dataset["subtitleId"]) {
          this.$store.commit("unmarkAsDeleted", {id: mutation.addedNodes[0].dataset["subtitleId"]})
        }
      }
    },
    input() {
      this.$store.dispatch("updateCurrentSubtitleText", {
        text: this.selectedSubtitleElement.innerHTML
      })
    },
    keypress(event) {
      // prevent creating divs on enter
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
    },
    paste(event) {
      // Remove editor spans from pasted text so as not to interfere with editors work
      event.preventDefault();
      var sanitizedData, pastedData;
      pastedData = (event.originalEvent || event).clipboardData.getData("text/html")
      sanitizedData = sanitizeEditorSpan(pastedData)
      document.execCommand("insertHTML", false, sanitizedData);
    },
    onSelectionChange() {
      if (window.getSelection().focusNode) {
        var selectedSubtitle = window.getSelection().focusNode
        var isSubtitle = () => selectedSubtitle.dataset ? selectedSubtitle.dataset["subtitleId"] : false
        while (this.$el.contains(selectedSubtitle) && this.$el != selectedSubtitle && !isSubtitle() && selectedSubtitle != null) {
          selectedSubtitle = selectedSubtitle.parentNode
        }
        if (isSubtitle()) {
          this.selectedSubtitleElement = selectedSubtitle
          this.$store.commit("setCurrentSubtitle", {
            id: selectedSubtitle.dataset["subtitleId"]
          })
        }
      }
    },
    getSelectionInSubtitle() {
      var text = this.selectedSubtitleElement.innerText
      var selection = {
        start: getSelectionStart(this.selectedSubtitleElement),
        end: getSelectionEnd(this.selectedSubtitleElement)
      }
      if (selection) {
        return {
          text: text,
          ...selection,
          textBefore: text.substring(0, selection.start),
          textSelected: text.slice(selection.start, selection.end),
          textAfter: text.substring(selection.end, text.length)
        }
      } else {
        return null
      }
    }
  },
  mounted() {
    document.addEventListener("selectionchange", this.onSelectionChange)

  }
};
</script>

<style scoped>
div {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 5px;
  box-sizing: border-box;
  /* will-change: contents; */
  /* white-space: pre; */
}
</style>
