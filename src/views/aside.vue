<template>
  <div class='main'>
    <div class="tools">
      <i class='el-icon-document-add' @click="addFile" title='添加音乐'></i>
      <i class='el-icon-folder-add' @click="addFolder" title='添加文件夹'></i>
      <i class='el-icon-setting' @click="dialogVisible = true"></i>
    </div>
    <ol class='list'>
      <li v-for="(v) in list" :key="v.id" :class="activeIndex == v.id ? 'active': ''" @dblclick="selectMusic(v.id)" @click="selectMusicOnly(v.id)" :title="v.name">{{v.name}}</li>
    </ol>
    <div class="current">
      <i class="cover"></i>
      <span :title="musicName">{{musicName}}</span>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :show-close='false'
      width="50%">
      <section>
        <h3>myaMusic</h3>
        <p>版本：1.0</p>
        <p>作者：Tony Ma</p>
        <p>技术栈：vue+element+electron</p>
        <p>功能：</p>
        <ul>
          <li>1.添加单/多个本地音乐，添加文件目录，删除delete；</li>
          <li>2.播放歌曲，歌词同步(歌词lrc文件同名，放和歌曲同级目录下)，最小化到托盘；</li>
          <li>3.列表循环、单曲循环、随机播放；</li>
          <li>4.调整播放进度，调节音量、静音</li>
        </ul>
        <p>项目地址：https://github.com/maya1900/myamusic</p>
        <p>更新时间：2021-11-20</p>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapState } from 'vuex'
import player from '../js/player'
// import player from '../js/player.js'
export default {
  data() {
    return { 
      list: [],
      activeIndex: null,
      musicName: '暂无歌曲播放',
      dialogVisible: false
    }
  },
  methods: {
    addFile() {
      ipcRenderer.send('open-music-file')
    },
    addFolder() {
      ipcRenderer.send('open-music-folder')
    },
    selectMusicOnly(val) {
      this.activeIndex = val
    },
    selectMusic(val) {
      this.activeIndex = val
      player.play(val)
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.keyCode == 46) {
        let next = null;
        for (let i = 0; i < this.songs.length; i++) {
          let song = this.songs[i];
          if (song.id === this.activeIndex) {
            next = this.songs[i + 1] ? this.songs[i + 1].id : this.songs[i - 1] ? this.songs[i - 1].id : null
          }
        }
        player.remove(this.activeIndex)
        this.activeIndex = next
      }
    }
  },
  computed: {
    ...mapState(['songs', 'status'])
  },
  watch: {
    songs: {
      immediate: true,
      deep: true,
      handler(val) {
        // console.log(val);
        this.list = val
      }
    },
    'status.currentSongId'(val) {
      // console.log(val, this.songs);
      if (val === -1) {
        this.musicName = '暂无歌曲播放'
      } else {
        this.songs.forEach((song) => {
          if (song.id == val) {
            this.musicName = song.name
            this.activeIndex = val
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .tools {
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: rgba(184, 182, 182, 0.596);
      i {
        font-size: 25px;
        color: #fff;
        cursor: pointer;
      }
    }
    .list {
      padding: 10px;
      height: calc(100% - 50px);
      overflow-y: auto;
      li {
        height: 25px;
        line-height: 25px;
        user-select: none;
        font-size: 14px;
        white-space: nowrap;
        overflow-x: hidden;
        &:hover {
          background-color: #ccc;
        }
        &.active {
          background-color: #ccc;
        }
      }
    }
    .current {
      display: flex;
      height: 50px;
      padding: 5px 10px;
      background-color: #eee;
      align-items: center;
      box-shadow: 0 -3px 3px 0px #ccc;
      .cover {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border: 1px solid #ccc;
        background:  url('~@/images/album_cover.png') no-repeat 50% 50%;
        background-size: 100%;
      }
      span {
        flex: 1;
        white-space: nowrap;
        font-size: 14px;
        overflow: hidden;
        user-select: none;
      }
    }
  }
</style>
