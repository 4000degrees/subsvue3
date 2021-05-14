<template>
<span :data-subtitle-id="id" @dragstart="dragStart"></span>
</template>

<script>
import {
  sanitizeEditorSpan,
  convertHTMLEntities,
  getTextSelectionWhithin
} from "../misc.js"
export default {
  name: "SolidEditorSubtitle",
  components: {},
  props: ["key","index"],
  data() {
    return {
      id: this.$.vnode.key,
    };
  },
  computed: {
    selected() {
      return this.$store.state.currentSubtitle === this.id
    },
    text: {
      get() {
        return this.$store.state.subtitles[this.id].text
      }
    }
  },
  watch: {
    text(newValue) {
      // if (!this.editorFocused()) {
      if (this.$el.innerHTML != newValue) {
        this.$el.innerHTML = newValue
      }
      // }
    },
    selected(newValue) {
      if (!this.$el.parentNode) {
        return
      }
      if (newValue == true) {
        this.$el.classList.add("focus")
        if (!this.editorFocused()) {
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
    },
    visibleY() {
      var el = this.$el
      var rect = el.getBoundingClientRect(),
        top = rect.top,
        height = rect.height
      el = el.parentNode
      // Check if bottom of the element is off the page
      if (rect.bottom < 0) return false
      // Check its within the document viewport
      if (top > document.documentElement.clientHeight) return false
      do {
        rect = el.getBoundingClientRect()
        if (top <= rect.bottom === false) return false
        // Check if the element is out of view due to a container scrolling
        if ((top + height) <= rect.top) return false
        el = el.parentNode
      } while (el != document.body)
      return true
    },
    blockIfInvisible() {
      if (this.visibleY()) {
        this.$el.style.display = "inline";
      } else {
        this.$el.style.display = "block";
      }
    }
  },
  mounted() {
    this.$el.innerHTML = this.text + (this.text.charAt(this.text.length - 1) == ' ' ? '' : ' ')

    /* optimisation: when editing a huge subtitles file,
    contenteditable in chromium becomes very laggy. it has to realculate all the following text when all subtitle element
     are inline. so this code makes every nth element a block when it is out of view. this is test
     stuff. when selecting all text to copy there will be additional
     line breakes around block elements. */
    let everynth = 100
    let nth = (Math.floor(this.index / everynth)) - (Math.floor((this.index - 1) / everynth))
    if (nth) {
      this.blockIfInvisible()
      this.$parent.$el.addEventListener("scroll", this.blockIfInvisible)
    }

  },
  beforeUnmount() {}
}
</script>

<style scoped>
span {
  /* white-space: pre; */
  /* white-space: break-spaces; */
  white-space: pre-wrap;
  min-width: 40px;
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
