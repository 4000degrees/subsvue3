<template>
<div id="app" class="grid-stack">

  <div class="grid-stack-item" data-grid-ref="button-container">
    <div class="grid-stack-item-content">
      <button type="button" @click="save">Save</button>
      <button type="button" @click="load">Load</button>
      <button type="button" @click="saveFile">Download srt</button>
      <label for="videoFollowsSubtitles">Video time follows subtitles
        <input type="checkbox" name="videoFollowsSubtitles" v-model="videoFollowsSubtitles">
      </label>
      <FileInput />
    </div>
  </div>


  <div class="grid-stack-item" data-grid-ref="player">
    <div class="grid-stack-item-content">
      <VideoPlayer ref="player" />
    </div>
  </div>

  <div class="grid-stack-item" data-grid-ref="solid-editor">
    <div class="grid-stack-item-content">
      <SolidEditor />
    </div>
  </div>

  <div class="grid-stack-item" data-grid-ref="single-subtitle-ce">
    <div class="grid-stack-item-content">
      <SingleSubtitleCE />
    </div>
  </div>

  <div class="grid-stack-item" data-grid-ref="subtitle-table">
    <div class="grid-stack-item-content">
      <Table />
    </div>
  </div>
</div>
</template>

<script>
import SolidEditor from "./SolidEditor.vue";
import SingleSubtitleEditor from "./SingleSubtitleEditor.vue";
import SingleSubtitleCE from "./SingleSubtitleCE.vue";
import Table from "./Table.vue";
import FileInput from "./FileInput.vue";
import VideoPlayer from "./VideoPlayer.vue";
import saveFile from './saveFile'

import CommandManager from './commandManager'

import 'gridstack/dist/gridstack.min.css';
import {
  GridStack
} from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';

import {
  mapGetters
} from 'vuex'


export default {
  name: "App",
  components: {
    SolidEditor,
    SingleSubtitleEditor,
    SingleSubtitleCE,
    Table,
    FileInput,
    VideoPlayer
  },
  props: [],
  mounted() {

    this.$store.state.gridStackData.forEach((item) => {
      let el = document.querySelector("[data-grid-ref='" + item.dataRef + "']")
      el.setAttribute("gs-x", item.x)
      el.setAttribute("gs-y", item.y)
      el.setAttribute("gs-w", item.w)
      el.setAttribute("gs-h", item.h)
    });

    var gridstack = GridStack.init({
      float: true,
      cellHeight: "1em",
      // cellWidth: "20px",
      minRow: 1,
      margin: 3
    });

    gridstack.on("change", () => {
      let griddata = Array.from(document.querySelectorAll(".grid-stack-item")).map(el => {
        return {
          dataRef: el.dataset["gridRef"],
          x: el.getAttribute("gs-x"),
          y: el.getAttribute("gs-y"),
          w: el.getAttribute("gs-w"),
          h: el.getAttribute("gs-h")
        }
      })
      this.$store.commit("updateGridStackData", griddata)
    })

    window["gridstack"] = gridstack


    var cm = new CommandManager({
      player: this.$refs.player.$refs.playerElement,
      state: this.$store.state
    })


    window["cm"] = cm
  },
  data() {
    return {};
  },
  methods: {
    save() {
      localStorage.setItem("state", JSON.stringify(this.$store.state))
    },
    load() {
      this.$store.replaceState(JSON.parse(localStorage.getItem("state")))
    },
    saveFile() {
      saveFile(this.$store.getters.subtitles)
    }
  },
  computed: {
    videoFollowsSubtitles: {
      get() {
        return this.$store.state.videoFollowsSubtitles
      },
      set(v) {
        this.$store.state.videoFollowsSubtitles = v
      }
    },
  }
}
</script>

<style scoped>
.grid-stack-item-content {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
</style>
