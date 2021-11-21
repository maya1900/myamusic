<template>
  <el-container>
    <el-header style="-webkit-app-region: drag; -webkit-user-select: none">
      <h3>
        <i class="icon"></i>myaMusic
      </h3>
      <div class="tool">
        <i class="el-icon-minus" @click="minimize()"></i>
        <i class="el-icon-close" @click="close()"></i>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <m-aside />
      </el-aside>
      <el-main>
        <m-main />
      </el-main>
    </el-container>
    <el-footer>
      <m-footer />
    </el-footer>
  </el-container>
</template>

<script>
import { ipcRenderer } from 'electron';
import mAside from './aside'
import mFooter from './footer'
import mMain from './main.vue'
import player from '../js/player.js'
import dataStorage from '../js/dataStorage.js'
export default {
  methods: {
    close() {
      ipcRenderer.send('close');
    },
    minimize() {
      ipcRenderer.send('minimize');
    },
  },
  components: {
    mAside, mFooter, mMain
  },
  created() {
    this.$store.commit('sync', dataStorage.getAppData())
    this.$store.subscribe((mutation, state) => {
      dataStorage.setAppData(state)
    })
    player.init()
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    background-color: #c52f30;
    color: #fff;
    .icon {
      display: inline-block;
      width: 25px;
      height: 25px;
      vertical-align: middle;
      margin-right: 10px;
      background: url('~@/images/icon.png') no-repeat 50% 50%;
      background-size: 100%;
    }
    .tool {
      i {
        cursor: pointer;
        margin-left: 10px;
        -webkit-app-region: no-drag;
      }
    }
  }
  .el-aside {
    height: 100%;
    border-right: 1px solid #ccc;
    background-color: #f1f2f6;
  }
  .el-main {
    background-color: #f2f2f4;
  }
  .el-footer {
    border-top: 1px solid #ccc;
    background-color: #f1f2f6;
  }
}
</style>
