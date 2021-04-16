<template>
  <table>
  <thead>
    <tr>
      <th>Start</th>
      <th>End</th>
      <th>Text</th>
    </tr>
  </thead>
  <tbody>
    <TableRow v-for="(subtitle, uniq) in subtitles" :subtitle="subtitle" :uniq="uniq"/>
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
  props: {
  },
  created() {
  },
  data() {
    return {
    };
  },
  computed: {
    subtitles() {
      return this.$store.state.projectData
    },
  }
}
</script>

<style scoped>
table {
  height: 500px;
  display: block;
  overflow: scroll;
}
</style>
