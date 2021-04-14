<template>
<span contenteditable="true" class="title" :class="uniq" :id="uniq">
</span>
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
    text: ""
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$store.commit("setSubtitleElement", {
      obj: this.subtitle,
      el: this.$el
    })
    this.$el.innerHTML = this.text + ' '
  },
  created() {},
  watch: {
    text(newValue, oldValue) {
      if (!this.editorFocused) {
        this.$el.innerHTML = newValue
      } else {
        newValue = convertHTMLEntities(newValue)
      }
    }
  },
  computed: {

    editorFocused: {
      cache: false,
      get() {
        var editorFocused = false;

        if (this.$store.state.editorElement != null) {
          editorFocused = this.$store.state.editorElement.contains(window.getSelection().focusNode)
        }
        return editorFocused;
      }
    },

  },
  methods: {

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
