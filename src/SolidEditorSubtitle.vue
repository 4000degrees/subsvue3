<template>
<span v-observer:subtree.characterData="onCharacterDataChange" class="title" :class="uniq" :id="uniq"></span>
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

    // 2nd way to detect input on child of contenteditable
    // this.$parent.$el.addEventListener("input", function(event) {
    //   var selectedElement = window.getSelection().focusNode;
    //   if (this.$el.contains(selectedElement)) {
    //     while (selectedElement !== this.$el) {
    //       selectedElement = selectedElement.parentNode;
    //     }
    //     console.log(selectedElement)
    //     this.$store.commit("updateSubtitle", {
    //       obj: this.subtitle,
    //       text: selectedElement.innerHTML
    //     })
    //   }
    // }.bind(this))
  },
  created() {
  },
  watch: {
    text(newValue, oldValue) {
      if (!this.editorFocused) {
        this.$el.innerHTML = newValue
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
  },
  methods: {
    // third way to detect input
    // v-observer:subtree.characterData="onCharacterDataChange"
    onCharacterDataChange(mutationsList) {
        this.$store.commit("updateSubtitle", {
          obj: this.subtitle,
          text: this.$el.innerHTML
        })
    }
  }
}
</script>

<style scoped>
span {
  /* white-space: pre-line; */
}

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
