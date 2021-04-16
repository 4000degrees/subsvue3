<template>
<span v-observer:subtree.characterData.childList="mutationObserver" :class="uniq" :id="uniq"></span>
</template>

<script>
import {
  convertHTMLEntities
} from "./misc.js"
export default {
  name: "SolidEditorSubtitle",
  components: {},
  props: {
    subtitle: "",
    uniq: "",
    text: "",
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.commit("setSubtitleElement", {
      obj: this.subtitle,
      el: this.$el
    })
    this.$el.innerHTML = this.text + ' '
    document.addEventListener('selectionchange', this.onSelectionChange);
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
      if (newValue == true) {
        this.$el.classList.add("focus")
        let offsetTop = this.$el.offsetTop - (this.$el.parentNode.offsetHeight / 2 - this.$el.offsetHeight)
        this.$el.parentNode.scrollTop = offsetTop
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

    }
  },
  methods: {
    // third way to detect input
    // v-observer:subtree.characterData="onCharacterDataChange"
    mutationObserver(mutationsList) {
      this.$store.commit("updateSubtitle", {
        obj: this.subtitle,
        text: this.$el.innerHTML
      })
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
