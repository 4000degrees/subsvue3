<template>
<span :data-subtitle-id="subtitle.id" @dragstart="dragStart"></span>
</template>

<script>
import {
  sanitizeEditorSpan,
  convertHTMLEntities,
  getTextSelectionWhithin
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
  computed: {
    selected() {
      return this.$store.state.currentSubtitle === this.subtitle
    },
    text: {
      get() {
        return this.subtitle.text
      }
    }
  },
  watch: {
    text(newValue) {
      if (!this.editorFocused()) {
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
  methods: {
    editorFocused() {
      return this.$parent.$el.contains(document.activeElement);
    },
    dragStart(event) {
      // prevent inserting subtitle spans markup when drag n dropping
      var sanitizedData, draggedData;
      draggedData = event.dataTransfer.getData("text/html")
      sanitizedData = sanitizeEditorSpan(draggedData)
      event.dataTransfer.clearData("text/html")
      event.dataTransfer.setData("text/html", sanitizedData)
    }
  },
  mounted() {
    this.$el.innerHTML = (this.text.charAt(0) == ' ' ? '' : ' ') + this.text

    document.addEventListener('selectionchange', this.onSelectionChange);
  },
  beforeUnmount() {
    document.addEventListener('selectionchange', this.onSelectionChange);
  }
}
</script>

<style scoped>
span {
  /* white-space: pre; */
  /* white-space: break-spaces; */
  white-space: pre-wrap;
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

/* span:before {
  content: " ";
  white-space: pre;
}
span:after {
  content: " ";
  white-space: pre;
} */
</style>
