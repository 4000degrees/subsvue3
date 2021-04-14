<template>
  <tr>
    <td>{{uniq}}</td>
    <td>{{start}}</td>
    <td>{{end}}</td>
    <td>{{subtitle.text}}</td>
  </tr>
</template>

<script>
import {ms2time} from './misc.js'
export default {
  name: "TableRow",
  components: {
  },
  props: {
    subtitle: "",
    uniq:""
  },
  created() {
  },
  data() {
    return {
    };
  },
  computed: {
    start() {
      return ms2time(this.subtitle.start)
    },
    end() {
      return ms2time(this.subtitle.end)
    },
  }
}
</script>

<style></style>
