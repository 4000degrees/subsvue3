<template>
<div id="SolidEditor" v-observer.childList="onChildListChange" contenteditable="true">
  <SolidEditorSubtitle v-for="(sub, uniq, index) in subtitles" :subtitle="sub" :uniq="uniq" :index="index" :text="sub.text" />
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
      // this.$store.commit("updateSubtitleText", {
      //   // first way to detect input on child
      //   // since the subtitle itself doesn't have
      //   // input events and thus can't put new text into model, the editor has to handle this
      //   id: this.$store.state.currentSubtitle.id,
      //   text: this.$store.state.currentSubtitle.innerHTML
      // })
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
        if (mutation.removedNodes[0]) {
          this.$store.commit("deleteSubtitle", mutation.removedNodes[0].id)
        }
      }
    }
  },
  created() {
    document.addEventListener('selectionchange', this.findSelectedTitle.bind(this));
    console.log(this)
  },
  updated() { //
    console.log("render")
  },
  mounted() {
    this.$store.commit("setEditorElement", this.$el)

    // Prevent pasting html into the editor. Otherwise subtitle markup gets pasted.
    this.$el.addEventListener("paste", function(e) {
      e.preventDefault();
      var text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand("insertHTML", false, text);
    });

    this.$el.addEventListener("keypress", function keypress(event) {
      if (event.keyCode == 13) {
        event.preventDefault()
        // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
        document.execCommand('insertHTML', false, '<br>');
        // prevent the default behaviour of return key pressed
        return false;
      }
    }, )


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
  position:relative;
  width: 600px;
  height: 400px;
  background: lightgray;
  overflow: scroll;
  /* will-change: contents; */
}
</style>
