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
    <SubtitleTableRow v-for="subtitle in subtitles" :key="subtitle.id" :subtitle="subtitle" />
  </tbody>
</table>
</template>

<script>
import SubtitleTableRow from "./SubtitleTableRow.vue";
import {
  mapGetters
} from 'vuex'

export default {
  name: "SubtitleTable",
  components: {
    SubtitleTableRow
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["subtitles"])
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
