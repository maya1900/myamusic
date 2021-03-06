import store from '../store'
import _ from 'lodash'
import path from 'path'
const { ipcRenderer } = require('electron');
const remoteFunctions = require('./remoteFunctions')
const fs = require('fs');

function syncSongsMetas(songs, index = 0) {
  if (index < songs.length) {
    remoteFunctions.readAudioTags(songs[index].src).then(tags => {
      syncSongsMetas(songs, index + 1)
      store.commit('addSong', {
        id: songs[index].id,
        name: tags.title,
        src: 'file://' + songs[index].src,
        metas: {
          artist: tags.artist,
          album: tags.album,
          cover: 'file://' + tags.cover
        }
      })
    }).catch((tags, error) => {
      console.log('error:', tags, error);
    })
  }
}

ipcRenderer.on('selected-file', (ev, pathList) => {
  if (Array.isArray(pathList)) {
    let list = _.cloneDeep(store.state.pathList);
    let listArr = []
    pathList.forEach((e, i) => {
      if (list.map(item => item.src).indexOf(e) === -1) {
        let id = new Date().getTime() + '_' + i + '_' + Math.ceil(1000 + 9999 * Math.random())
        let obj = {
          id,
          name: path.basename(e),
          src: e
        }
        list.push(obj)
        listArr.push(obj)
      }
    })
    store.commit('set_pathList', list)
    listArr.length && syncSongsMetas(listArr)
  }
})

ipcRenderer.on('selected-folder', (ev, pathList) => {
  if (Array.isArray(pathList)) {
    let list = store.state.pathList;
    let listArr = []
    fs.readdir(pathList[0],(err, files) => {
      for(let [i,item] of files.entries()) {
        let pathName = `${pathList[0]}\\${item}`
        let id = new Date().getTime() + '_' + i + '_' + Math.ceil(1000 + 9999 * Math.random())
        if (list.map(item => item.src).indexOf(pathName) === -1 && (pathName.indexOf('.mp3') !== -1 || pathName.indexOf('.flac') !== -1 || pathName.indexOf('.m4a') !== -1)) {
          let obj = {
            id,
            name: path.basename(pathName),
            src: pathName
          }
          list.push(obj)
          listArr.push(obj)
        }
      }
    })
    store.commit('set_pathList', list)
    listArr.length && syncSongsMetas(listArr)
  }
})


