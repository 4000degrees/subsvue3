
<template>
<input type="file" @change="readFile" />
</template>

<script>
import subsFormatsParser, {
  formatSupported
} from './subsFormatsParser'
import {getFileExtension } from './misc'

export default {
  name: "FileInput",
  components: {},
  props: [],
  created() {},
  data() {
    return {};
  },
  methods: {

    readFile(event) {
      var file = event.target.files[0];
      var extension = getFileExtension(file.name)
      if (!file) {
        return;
      }
      if (!formatSupported(extension)) {
        console.log("Unsupported");
        return;
      }
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e) {
        var contents = e.target.result;
        subsFormatsParser(contents, extension)
      };
      reader.onerror = function() {
        console.log(reader.error);
      };
    }
  }
}
</script>

<style></style>
