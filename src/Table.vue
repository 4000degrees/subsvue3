<template>
<table tabindex="0">
  <thead>
    <tr>
      <th>Start</th>
      <th>End</th>
      <th>Text</th>
    </tr>
  </thead>
  <tbody>
    <TableRow v-for="subtitle in subtitles" :key="subtitle.id" :subtitle="subtitle" />
  </tbody>
</table>
</template>

<script>
import TableRow from "./TableRow.vue";
export default {
  name: "Table",
  components: {
    TableRow
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    subtitles() {
      return this.$store.getters.subtitles
    },
  }
}
</script>

<style scoped>
table {
  width: 100%;
  height: 100%;
  display: block;
  overflow-y: scroll;
}
</style>
