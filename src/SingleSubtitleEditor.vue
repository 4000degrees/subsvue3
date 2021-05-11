<template>
<div>
  <textarea rows="8" cols="80" v-model="text"></textarea>
</div>
</template>

<script>
export default {
  name: "SingleSubtitleEditor",
  components: {},
  data() {
    return {};
  },
  computed: {
    text: {
      get() {
        return this.prepareText(this.$store.getters.currentSubtitleText)
      },
      set(text) {
        this.$store.dispatch("updateCurrentSubtitleText", text.replace(/\n/gim, "<br>"))
      }
    }
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
