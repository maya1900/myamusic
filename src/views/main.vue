<template>
  <div class="main">
    <div class="title">
      {{mName ? mName : '暂无歌曲播放'}}
    </div>
    <div class="con">
      <div class="con-lyric" :style="[{ height: contentHeight + 'px', transform: transform3d }]" ref="panelContentDom" v-if="lrcArr.length">
        <pre
          v-for="(item, index) in lrcArr"
          :key="index"
          ref="preAllDom"
          :class="{'lyric-active': index === curIndex}"
        >{{ item }}</pre>
      </div>
      <span v-else>暂无歌词信息！</span>
    </div>
  </div>
</template>

<script>
import Lyric from "../js/lyric"
import { mapState } from 'vuex'
export default {
  data() {
    return {
      mName: '',
      lrcArr: [],
      curIndex: -1,
      contentHeight: 380,
      transform3d: 'translate3d(0, 0, 0)',
    }
  },
  methods: {
    initLrcArr(lrcMap) {
      let arr = []
      for(let prop in lrcMap) {
        arr.push(lrcMap[prop])
      }
      return arr
    },
    scrollLyric(index) {
      try {
        if (typeof index === "number" && this.$refs["preAllDom"].length > 0) {
          this.curIndex = index
          let height = parseInt(window.getComputedStyle(this.$refs["preAllDom"][index], null)["height"])
          let curHeight = index * (height + 14) - 160
          // console.log(curHeight, this.contentHeight);
          if (curHeight >= 0 && curHeight <= this.contentHeight) {
              curHeight *= -1
              this.transform3d = "translate3d(0, " + curHeight + "px, 0)"
          } else {
              // this.transform3d = "translate3d(0, " + 0 + "px, 0)"
          }
        }
      } catch (e) {
        //
      }
    },
    initContentHeight() {
      this.$nextTick(() => {
        let allHeight = 0
        if (this.$refs["preAllDom"]) {
            this.$refs["preAllDom"].forEach((dom) => {
                let height = parseInt(window.getComputedStyle(dom, null)["height"])
                if (!isNaN(height)) {
                    allHeight += height + 14
                }
            })
            this.contentHeight = allHeight
        } else {
            this.contentHeight = 5000
        }
      })
    }
  },
  watch: {
    'status.currentSongId'(id) {
      this.contentHeight = 5000
      this.lrcArr = []
      this.curIndex = -1
      this.transform3d = "translate3d(0, " + 0 + "px, 0)"
      let ly = new Lyric(id);
      // console.log('ly', ly);
      this.mName = ly.name.slice(0, -4)
      this.lrcArr = this.initLrcArr(ly.lrcMap)
      this.initContentHeight()
    },
    'tempStatus.played' (time) {
      let ly = new Lyric(this.status.currentSongId);
      let lyric = ly.getCurPlayLyric(time)
      // console.log(lyric);
      if (lyric) {
        this.scrollLyric(lyric.curIndex)
      }
    }
  },
  computed: {
    ...mapState(['status', 'tempStatus'])
  },
  moutned() {
   
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
  }
  .con {
    height: 380px;
    position: relative;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.6) 15%,
          rgba(255, 255, 255, 1) 25%,
          rgba(255, 255, 255, 1) 75%,
          rgba(255, 255, 255, 0.6) 85%,
          rgba(255, 255, 255, 0) 100%
      );
    .con-lyric {
      
      height: 380px;
      transition: all 1s;
      transform: translate3d(0, -20px, 0);
      box-sizing: border-box;
      
      pre {
        height: 20px;
        font-family: "Arial","Microsoft YaHei",sans-serif;
        font-size: 14px;
        color: #000;
        margin: 0;
        padding: 14px 0 0 0;
        &.lyric-active {
          font-size: 18px;
          color: red;
        }
      }
    }
    
  }
}
</style>
