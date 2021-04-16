

<template>
<div>
  <textarea rows="8" cols="80" v-model="text"></textarea>
</div>
</template>

<script>
export default {
  name: "SingleSubtitleEditor",
  components: {},
  computed: {
    text: {
      get() {
        return this.prepareText(this.$store.getters.currentSubtitleText)
      },
      set(text) {
        this.$store.commit("updateSubtitle", {
          obj: this.$store.state.currentSubtitle,
          text: text.replace(/\n/gim, "<br>")
        })
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    prepareText(text) {
      let replacements = [
        ['&nbsp;', ' '],
        ['<br[^>]*>', '\n'],
      ]
      replacements = new Map(replacements)
      replacements.forEach((replacement, regex) => {
        text = text.replace(new RegExp(regex, "gim"), replacement)
      })
      return text
    }
  }
}
</script>

<style></style>
