

<template>
<div id="app">
  <FileInput />
  <SolidEditor />
  <SingleSubtitleEditor />
  <Table />
</div>
</template>

<script>
import Counter from "./Counter.vue";
import SolidEditor from "./SolidEditor.vue";
import SingleSubtitleEditor from "./SingleSubtitleEditor.vue";
import Table from "./Table.vue";
import FileInput from "./FileInput.vue";
export default {
  name: "App",
  components: {
    Counter,
    SolidEditor,
    SingleSubtitleEditor,
    Table,
    FileInput
  },
  props: [],
  created() {
    var f = this.$store.state.projectData[Object.keys(this.$store.state.projectData)[0]]
    var vel = document.getElementById(f)
    this.$store.commit("setCurrentSubtitle", {id: Object.keys(this.$store.state.projectData)[0]})
  },
  data() {
    return {
    };
  }
}
</script>

<style></style>
