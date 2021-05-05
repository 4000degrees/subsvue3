<template>
<tr @click="onClick()">
  <td>{{start}}</td>
  <td>{{end}}</td>
  <td v-html="subtitle.text" class="text"></td>
</tr>
</template>

<script>
import {
  ms2time
} from './misc.js'
export default {
  name: "TableRow",
  components: {},
  props: {
    subtitle: "",
    uniq: ""
  },
  created() {},
  data() {
    return {};
  },
  watch: {
    selected(newValue) {
      if (newValue == true) {
        this.$el.classList.add("focus")
        if (!this.tableFocused) {
          let offsetTop = this.$el.offsetTop - (this.$el.parentNode.parentNode.offsetHeight / 2 - this.$el.offsetHeight)
          this.$el.parentNode.parentNode.scrollTop = offsetTop
        }
      } else {
        this.$el.classList.remove("focus")
      }
    }
  },
  methods: {
    onClick(event) {
      this.$store.commit("setCurrentSubtitle", this.subtitle)
    }
  },
  computed: {
    start() {
      return ms2time(this.subtitle.start)
    },
    end() {
      return ms2time(this.subtitle.end)
    },
    selected() {
      return this.$store.state.currentSubtitle === this.subtitle
    },
    tableFocused() {
      return this.$parent.$el.contains(document.activeElement);
    },
  }
}
</script>

<style scoped>
.text {
  width: 100%;
}
tr:hover {
  background: lightgrey;
}

tr.focus {
  background: lightpink;
}
</style>
