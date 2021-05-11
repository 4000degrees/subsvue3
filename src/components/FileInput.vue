
<template>
<input type="file" @change="openSubtitlesFile" />
</template>

<script>
import subsFormatsParser, {
  formatSupported
} from '../subtitle-formats-parser'
import {
  getFileExtension
} from '../misc'
import {
  mapActions
} from 'vuex'
export default {
  name: "FileInput",
  components: {},
  props: [],
  data() {
    return {};
  },
  methods: {
    ...mapActions(["openSubtitlesFile"])
  }
}
</script>

<style></style>
