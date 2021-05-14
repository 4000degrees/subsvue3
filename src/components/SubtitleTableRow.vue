<template>
<tr @click="onClick">
  <td>{{start}}</td>
  <td>{{end}}</td>
  <td v-html="text" :data-subtitle-id="id" class="text"></td>
</tr>
</template>

<script>
import {
  ms2time
} from '../misc.js'
export default {
  name: "SubtitleTableRow",
  components: {},
  props: [],
  data() {
    return {
      id: this.$.vnode.key
    };
  },
  computed: {
    text() {
      return this.$store.state.subtitles[this.id].text
    },
    start() {
      return ms2time(this.$store.state.subtitles[this.id].start)
    },
    end() {
      return ms2time(this.$store.state.subtitles[this.id].end)
    },
    selected() {
      return this.$store.getters.currentSubtitle.id === this.id
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
      this.$store.commit("setCurrentSubtitle", {
        id: this.id
      })
    }
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
