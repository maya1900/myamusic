<template>
  <div class="main">
    <div class="tool">
      <i class="prev" @click="prev()"></i>
      <i :class="isPlay ? 'pause' : 'play'" @click="play()"></i>
      <i class="next" @click="next()"></i>
    </div>
    <div class="main">
      <span>{{start}}</span>
      <el-slider v-model="process" @change="setProgress" :format-tooltip="formatTip"></el-slider>
      <span>{{end}}</span>
    </div>
    <div class="vol">
      <i class="icon-vol" :class="isMuted ? 'ic-no-vol' : 'ic-vol'" @click="mute()"></i>
      <el-slider v-model="vol"></el-slider>
      <i class="icon-vol" :class="isLoop === 1 ? 'ic-loop3' : isLoop === 2 ? 'ic-loop1' : 'ic-loop2'" @click="loop()"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import player from '../js/player'
import { calcTime } from '../js/util.js'
export default {
  data() {
    return {
      isPlay: false,
      process: 0,
      vol: 50,
      start: '00:00',
      end: '00:00',
      url: '',
      isMuted: false,
      isLoop: 1
    }
  },
  methods: {
    play() {
      this.isPlay = !this.isPlay
      if (this.isPlay) {
        player.play()
      } else {
        player.pause()
      }
    },
    prev() {
      player.prev()
    },
    next() {
      player.next()
    },
    mute() {
      player.muted(!this.status.muted)
    },
    loop() {
      let { loopMode } = this.status
      player.loopMode(loopMode < 3 ? loopMode + 1 : 1)
    },
    setProgress(val) {
      player.progress(val / 100)
    },
    formatTip(val) {
      return calcTime(val / 100 * this.tempStatus.duration)
    }
  },
  watch: {
    'tempStatus.playing' (val) {
      this.isPlay = val
    },
    'status.muted' (val) {
      this.isMuted = val
    },
    'status.loopMode' (val) {
      this.isLoop = val
    },
    'tempStatus.duration' (val) {
      this.end = calcTime(val)
    },
    'tempStatus.played' (val) {
      this.start = calcTime(val)
      this.process = player.progress() * 100
    },
    vol (val) {
      player.volume(val / 100)
    },
  },
  computed: {
    ...mapState(['tempStatus', 'status'])
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tool {
    width: 120px;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    i {
      width: 32px;
      height: 32px;
      border-radius: 32px;
      cursor: pointer;
    }
    .prev {
      background: #c52f30 url('~@/images/prev.png') no-repeat 60% 50%;
      background-size: 60%;
    }
    .play {
      background: #c52f30 url('~@/images/play.png') no-repeat 60% 50%;
      background-size: 60%;
    }
    .pause {
      background: #c52f30 url('~@/images/pause.png') no-repeat 50% 50%;
      background-size: 60%;
    }
    .next {
      background: #c52f30 url('~@/images/next.png') no-repeat 60% 50%;
      background-size: 60%;
    }
  }
  .main {
    flex: 1;
    margin: 0 10px;
    .el-slider {
      width: 75%;
    }
  }
  .vol {
    width: 15%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon-vol {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .ic-vol {
      background: url('~@/images/vol.png') no-repeat 50% 50%;
      background-size: 80%;
    }
    .ic-no-vol {
      background: url('~@/images/no-vol.png') no-repeat 50% 50%;
      background-size: 80%;
    }
    .ic-loop1 {
      background: url('~@/images/ic-loop1.png') no-repeat 50% 50%;
      background-size: 80%;
    }
    .ic-loop2 {
      background: url('~@/images/ic-loop2.png') no-repeat 50% 50%;
      background-size: 80%;
    }
    .ic-loop3 {
      background: url('~@/images/ic-loop3.png') no-repeat 50% 50%;
      background-size: 80%;
    }
    .el-slider {
      flex: 1;
      margin: 4px;
    }
  }
}
</style>
