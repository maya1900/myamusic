import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pathList: [], 
    songs: [],
    tempStatus: {
      ready: false,
      playing: false,
      played: 0,
      duration: 1,
      importing: false,
      isFullScreen: false
    },
    status: {
      currentSongId: -1,
      currentPlaylist: {
        type: 'playlist',
        value: 1
      },
      currentMenu: {
        type: 'playlist',
        value: 1
      },
      volume: 0.7,
      muted: false,
      visualize: false,
      loopMode: 1
    }
  },
  mutations: {
    sync(state, data) {
      state.status = data.status
      state.songs = data.songs
      state.pathList = data.pathList
    },
    set_pathList(state, payload) {
      state.pathList = payload
    },
    set_current_play (state, payload) {
      state.currentPlay = payload
    },
    setTempStatus(state, status) {
      state.tempStatus = { ...state.tempStatus, ...status }
    },
    setStatus(state, status) {
      state.status = { ...state.status, ...status }
    },
    setVolume(state, volume) {
      state.status = { ...state.status, volume }
    },
    setMuted(state, muted) {
      state.status = { ...state.status, muted }
    },
    visualize(state, visualize) {
      state.status = { ...state.status, visualize }
    },
    setLoopMode(state, loopMode) {
      state.status = { ...state.status, loopMode }
    },
    setCurrentSongId(state, id) {
      state.status = { ...state.status, currentSongId: id }
    },
    removeSong(state, id) {
      state.songs = state.songs.filter((item) => item.id !== id)
      state.pathList = state.pathList.filter((item) => item.id !== id)
    },
    clear(state) {
      state.songs = []
    },
    addSong(state, song) {
      state.songs = [...state.songs, song]
    },
    setSong(state, songs) {
      state.songs = [...state.songs, ...songs]
    }
  },
  getters: {
    songs: (state) => {
      return state.songs
    },
    process: (state) => {
      return state.tempStatus.played / state.tempStatus.duration
    }
  }
})
