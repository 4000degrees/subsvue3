<template>
<tr @click="onClick">
  <td>{{start}}</td>
  <td>{{end}}</td>
  <td v-html="subtitle.text" :data-subtitle-id="subtitle.id" class="text"></td>
</tr>
</template>

<script>
import {
  ms2time
} from '../misc.js'
export default {
  name: "SubtitleTableRow",
  components: {},
  props: [
    "subtitle",
    "uniq"
  ],
  data() {
    return {};
  },
  computed: {
    start() {
      return ms2time(this.subtitle.start)
    },
    end() {
      return ms2time(this.subtitle.end)
    },
    selected() {
      return this.$store.getters.currentSubtitle === this.subtitle
    },
    tableFocused() {
      return this.$parent.$el.contains(document.activeElement);
    },
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
      this.$store.commit("setCurrentSubtitle", this.subtitle.id)
    }
  },
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
