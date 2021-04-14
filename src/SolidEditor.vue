<template>
<div id="SolidEditor" v-observer:childList="onChildListChange" contenteditable="true" @input="input($event)">
  <SolidEditorSubtitle v-for="(sub, uniq) in subtitles" :subtitle="sub" :uniq="uniq" :text="sub.text"/>
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
      return this.$store.state.projectData
    },
    currentSubtitle: {
      get() {
        return this.$store.state.currentSubtitle
      },
      set(currentSubtitle) {
        this.$store.commit("setCurrentSubtitle", currentSubtitle)
      }
    }
  },
  methods: {
    input(event) {
      this.$store.commit("updateSubtitleText", {
        // since the subtitle itself doesn't have
        // input events and thus can't put new text into model, the editor has to handle this
        id: this.$store.state.currentSubtitle.id,
        text: this.$store.state.currentSubtitle.innerHTML
      })
    },
    findSelectedTitle(event) {
      // get currently focused html in the editor to figure out which subtitle we are working on
      var selectedElement = null;
      if (!window.getSelection().focusNode) {
        return null;
      }
      selectedElement = window.getSelection().focusNode;
      if (!this.$el.contains(selectedElement) || this.$el === selectedElement) {
        return null;
      }
      if (!selectedElement.classList) {
        selectedElement = selectedElement.parentNode;
      }
      while (!selectedElement.classList.contains("title")) {
        selectedElement = selectedElement.parentNode;
      }
      this.currentSubtitle = selectedElement
      return selectedElement
    },
    updateCurrentSubtitleText() {
      this.$store.commit("updateCurrentSubtitleText")
    },
    onChildListChange(mutationsList, observer) {
      // Watch deletions of subtitles in the editor to delete them in the model


      for (const mutation of mutationsList) {
        // console.log(mutation)
        if (mutation.removedNodes[0]) {
          this.$store.commit("deleteSubtitle", mutation.removedNodes[0].id)

        }
      }
    }
  },
  created() {
    document.addEventListener('selectionchange', this.findSelectedTitle.bind(this));
  },
  mounted() {
    this.$store.commit("setEditorElement", this.$el)

    // Prevent pasting html into the editor. Otherwise subtitle markup gets pasted.
    this.$el.addEventListener("paste", function(e) {
        e.preventDefault();
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand("insertHTML", false, text);
    });


  },
  watch: {
    currentSubtitle(currentSubtitle, previousSubtitle) {
      if (previousSubtitle.classList) {
        previousSubtitle.classList.remove('focus');
      }
      currentSubtitle.classList.add('focus');
    }
  }
};
</script>

<style scoped>
div {
  display: inline-block;
  width: 600px;
  height: 400px;
  background: lightgray;
  overflow: scroll;
}
</style>
