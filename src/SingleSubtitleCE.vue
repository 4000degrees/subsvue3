

<template>
<div tabindex="0" contenteditable @input="input"></div>
</template>

<script>
export default {
  name: "SingleSubtitleCE",
  components: {},
  computed: {
    text: {
      get() {
        return this.$store.getters.currentSubtitleText
      },
      set(text) {
        this.$store.commit("updateSubtitle", {
          obj: this.$store.state.currentSubtitle,
          text: text
        })
      }
    }
  },
  data() {
    return {
      focused: false
    };
  },
  created() {
    document.addEventListener('focusin', this.focusChanged)
  },
  beforeUnmount() {
    document.removeEventListener('focusin', this.focusChanged)
  },
  mounted() {
    this.$el.innerHTML = this.text

    // Prevent pasting html into the editor. Otherwise subtitle markup gets pasted.
    this.$el.addEventListener("paste", function(e) {
      e.preventDefault();
      var text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand("insertHTML", false, text);
    });

    // prevent creating divs on enter
    this.$el.addEventListener("keypress", function keypress(event) {
      if (event.keyCode == 13) {
        event.preventDefault()
        if (window.getSelection().focusOffset == window.getSelection().focusNode.length || window.getSelection().focusNode.nodeType != 3) {
          document.execCommand('insertHTML', false, '<br><br>');
        } else {
          document.execCommand('insertHTML', false, '<br>');
        }
        return false;
      }
    })


  },
  watch: {
    text(newValue) {
      if (!this.focused) {
        this.$el.innerHTML = newValue
      }
    },
  },
  methods: {
    input() {
      this.text = this.$el.innerHTML
    },
    focusChanged(event) {
      this.focused = this.$el === event.target
    }
  }
}
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
  padding: 10px;
  /* border: 2px solid grey; */
  box-sizing:border-box;
  /* margin: 10px; */
  /* important */
  /* white-space: pre; */
  /*  */
}
</style>
