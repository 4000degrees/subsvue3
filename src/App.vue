

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
  created() {},
  data() {
    return {};
  }
}
</script>

<style></style>
