

<template>
<div id="app">
  <FileInput />
  <SolidEditor />
  <SingleSubtitleCE />
  <Table />
</div>
</template>

<script>
import Counter from "./Counter.vue";
import SolidEditor from "./SolidEditor.vue";
import SingleSubtitleEditor from "./SingleSubtitleEditor.vue";
import SingleSubtitleCE from "./SingleSubtitleCE.vue";
import Table from "./Table.vue";
import FileInput from "./FileInput.vue";
export default {
  name: "App",
  components: {
    Counter,
    SolidEditor,
    SingleSubtitleEditor,
    SingleSubtitleCE,
    Table,
    FileInput
  },
  props: [],
  mounted() {
    this.$store.commit("setCurrentSubtitle", this.$store.state.subtitles[0])
  },
  data() {
    return {};
  }
}
</script>

<style></style>
