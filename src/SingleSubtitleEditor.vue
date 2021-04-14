

<template>
<div>
<textarea rows="8" cols="80" v-model="text"></textarea>
</div>
</template>

<script>
export default {
  name: "SingleSubtitleEditor",
  components: {
  },
  computed: {
    text: {
      get() {
        return this.$store.getters.currentSubtitleText

      },
      set(text) {
        this.$store.commit("updateSubtitleText", {
          id: this.$store.state.currentSubtitle.id,
          text: text
        })
      }
    }
  },
  data() {
    return {
    };
  }
}
</script>

<style></style>
