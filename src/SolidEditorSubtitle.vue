<template>
<span v-observer:subtree.characterData.childList="mutationObserver"></span>
</template>

<script>
import {
  convertHTMLEntities
} from "./misc.js"
export default {
  name: "SolidEditorSubtitle",
  components: {},
  props: ["subtitle"],
  data() {
    return {
      drop: false
    };
  },
  mounted() {
    this.$store.commit("setSubtitleElement", {
      obj: this.subtitle,
      el: this.$el
    })
    this.$el.innerHTML = this.text + ' '
    document.addEventListener('selectionchange', this.onSelectionChange);

    // prevent inserting subtitle spans markup when drag n dropping
    this.$el.addEventListener("dragstart", (ev) => {
      var sanitizedData, draggedData;
      draggedData = ev.dataTransfer.getData("text/html")
      sanitizedData = draggedData.replace(/<\/?(\s+)?span([^>]+)?>/gim,"")
      ev.dataTransfer.clearData("text/html")
      ev.dataTransfer.setData("text/html", sanitizedData)
    })
  },
  created() {},
  updated() {},
  watch: {
    text(newValue, oldValue) {
      if (!this.editorFocused) {
        this.$el.innerHTML = newValue
      }
    },
    selected(newValue) {
      if (!this.$el.parentNode) {
        return
      }
      if (newValue == true) {
        this.$el.classList.add("focus")
        if (!this.editorFocused) {
          let offsetTop = this.$el.offsetTop - (this.$el.parentNode.offsetHeight / 2 - this.$el.offsetHeight)
          this.$el.parentNode.scrollTop = offsetTop
        }
      } else {
        this.$el.classList.remove("focus")
      }
    }
  },
  computed: {
    editorFocused: {
      cache: false,
      get() {
        return this.$parent.$el.contains(window.getSelection().focusNode);
      }
    },
    selected() {
      return this.$store.state.currentSubtitle === this.subtitle
    },
    text: {
      get() {
        return this.subtitle.text
      },
      set(text) {
        this.$store.commit("updateSubtitle", {
          obj: this.subtitle,
          text: text
        })
      }
    }
  },
  methods: {
    // third way to detect input
    // v-observer:subtree.characterData="onCharacterDataChange"
    mutationObserver(mutationsList) {
      this.text = this.$el.innerHTML
    },
    onSelectionChange() {
      if (this.$el.contains(window.getSelection().focusNode)) {
        this.$store.commit("setCurrentSubtitle", this.subtitle)
      }
    }
  },
  beforeDestroy() {
    document.addEventListener('selectionchange', this.onSelectionChange);
  }
}
</script>

<style scoped>
span {
  /* white-space: pre-line; */
}

/* span:nth-child(50n) {
  display:block;
} */
span:hover {
  background-color: gray;
}

span.focus {
  background-color: lightpink;
}

span:after {
  /* content: " "; */
  white-space: pre;
}
</style>
