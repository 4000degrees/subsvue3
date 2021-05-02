<template>
<div @dragover="dragover" @dragleave="dragleave" @drop="drop">

  <video controls ref="player"></video>
</div>
</template>

<script>
export default {
  name: "VideoPlayer",
  components: {},
  props: [],
  computed: {
    currentTime() {
      return this.$store.getters.currentTime
    },
  },
  watch: {
    currentTime(n) {
      this.$refs.player.currentTime = n / 1000
    }
  },
  mounted() {
    document.querySelector("[data-grid-ref='player'] > div").style.overflow = "hidden"

    this.$refs.player.src = "http://localhost/test.mp4";


  },
  data() {
    return {};
  },
  methods: {
    dragover(event) {
      event.preventDefault();
      event.currentTarget.classList.add('dragover');
    },
    dragleave(event) {
      event.currentTarget.classList.remove('dragover');
    },
    drop(event) {
      event.preventDefault();
      console.log(event.dataTransfer.files);
      event.currentTarget.classList.remove('dragover');
      this.playLocalFile(event.dataTransfer.files[0])
    },
    playLocalFile(file) {
      var type = file.type;
      var canPlay = this.$refs.player.canPlayType(type);
      canPlay = (canPlay === '' ? 'no' : canPlay);
      var message = 'Can play type "' + type + '": ' + canPlay;
      var isError = canPlay === 'no';
      if (isError) {
        return;
      }
      var fileURL = URL.createObjectURL(file);
      this.$refs.player.src = fileURL;
    }
  },

} //
</script>

<style scoped>
div {
  overflow: hidden;
}

video {
  max-width: 100%;
  width: 100%;
  height: 100%;
}

.dragover {
  position: relative;
}

.dragover * {
  pointer-events: none;
}

.dragover::before {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  background: pink;
  content: "Drop here to open video";
  opacity: 0.5;
  font-size: 3em;
  text-align: center;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
</style>
