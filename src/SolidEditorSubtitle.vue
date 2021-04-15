<template>
<span v-observer:subtree.characterData="onCharacterDataChange" class="title" :class="uniq" :id="uniq"></span>
</template>

<script>
import {
  convertHTMLEntities
} from "./misc.js"
export default {
  name: "SolidEditorSubtitle",
  components: {},
  props: {
    subtitle: "",
    uniq: "",
    text: "",
    index:""
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.commit("setSubtitleElement", {
      obj: this.subtitle,
      el: this.$el
    })
    this.$el.innerHTML = this.text + ' '

    // 2nd way to detect input on child of contenteditable
    // this.$parent.$el.addEventListener("input", function(event) {
    //   var selectedElement = window.getSelection().focusNode;
    //   if (this.$el.contains(selectedElement)) {
    //     while (selectedElement !== this.$el) {
    //       selectedElement = selectedElement.parentNode;
    //     }
    //     console.log(selectedElement)
    //     this.$store.commit("updateSubtitle", {
    //       obj: this.subtitle,
    //       text: selectedElement.innerHTML
    //     })
    //   }
    // }.bind(this))

    // this.$parent.$el.addEventListener("scroll", function(event) {
    //   if(this.visibleY()) {
    //     this.$el.style.visibility="visible";
    //   } else {
    //     this.$el.style.visibility="hidden";
    //
    //   }
    // }.bind(this))


    //
    /* optimisation: when editing a huge subtitles file, 
    contenteditable in chromium becuse very very laggy. this is
     because it has to realculate all the following text whe all subtitle element
     are inline. so this code makes every 5th element block when it is out of view. this is test
     stuff. when selecting all text to copy there will be additional
     line breakes around block elements. */

    // let ii = this.index+1
    // let nth = (Math.floor( ii / 50 )) - (Math.floor( (ii-1) / 50 ))
    // console.log(nth)
    //
    // if (nth) {
    //   this.$parent.$el.addEventListener("scroll", function(event) {
    //     if(this.visibleY()) {
    //       this.$el.style.display="inline";
    //       console.log("inline");
    //     } else {
    //       this.$el.style.display="block";
    //       console.log("block");
    //     }
    //   }.bind(this))
    // }


  },
  created() {
    console.log("create")
  },
  updated() { //
    console.log("render")
  },
  watch: {
    text(newValue, oldValue) {
      if (!this.editorFocused) {
        this.$el.innerHTML = newValue
      }
    },
    visibleY(newValue) {
      console.log(newValue)
    }
  },
  computed: {
    editorFocused: {
      cache: false,
      get() {
        return this.$parent.$el.contains(window.getSelection().focusNode);
      }
    },
  },
  methods: {
    // third way to detect input
    // v-observer:subtree.characterData="onCharacterDataChange"
    onCharacterDataChange(mutationsList) {
      this.$store.commit("updateSubtitle", {
        obj: this.subtitle,
        text: this.$el.innerHTML
      })
    },
    visibleY() {
      var el = this.$el
      var rect = el.getBoundingClientRect(),
        top = rect.top,
        height = rect.height,
        el = el.parentNode
      // Check if bottom of the element is off the page
      if (rect.bottom < 0) return false
      // Check its within the document viewport
      if (top > document.documentElement.clientHeight) return false
      do {
        rect = el.getBoundingClientRect()
        if (top <= rect.bottom === false) return false
        // Check if the element is out of view due to a container scrolling
        if ((top + height) <= rect.top) return false
        el = el.parentNode
      } while (el != document.body)
      return true
    }
  }
}
</script>

<style scoped>
span {
  /* white-space: pre-line; */
}

span:nth-child(40n) {
  display:block;
}

span:hover {
  background-color: gray;
}

span.focus {
  background-color: lightpink;
}

span:after {
  /* content: " "; */
  white-space: pre;
}
</style>
