import store from '../store'
import _ from 'lodash'
import fs from 'fs'
export default class Lyric {
  constructor(id) {
    this.data = this.getData(id);
    this.isGoOn = this.data !== ''
    this.name = this.getName(id);
    this.lrcMap = this.getLyricMap(this.data)
    this.finalLrcMap = this.convertProp(Object.assign({}, this.lrcMap))
  }

  getName(id) {
    let pathList = _.cloneDeep(store.state.pathList)
    for(let item of pathList) {
      if (item.id === id) {
        return item.name
      }
    }
    return '';
  }

  // 获取本地歌词
  getData(id) {
    let pathList = _.cloneDeep(store.state.pathList)
    let musicPath = ''
    for(let item of pathList) {
      if (item.id === id) {
        musicPath = item.src
        break
      }
    }
    if (musicPath) {
      let regExp = /^(?<path>(?:[a-zA-Z]:)?\\(?:[^\\?/*|<>:"]+\\)+)(?<filename>(?<name>[^\\?/*|<>:"]+?)\.(?<ext>[^.\\?/*|<>:"]+))$/
      let regResult = musicPath.match(regExp)  // C:\\Users\\high3\\Desktop\\11\\Follow（罗生门）-梨冻紧、Wiz_H张子豪.mp3
      if (regResult) {
        let path = regResult['groups'].path.slice(0, -1)
        let name = regResult['groups'].name
        let lrcPath = path + '\\' + name + '.lrc'
        if (fs.existsSync(lrcPath)) {
          return fs.readFileSync(lrcPath, 'UTF-8')
        } else {
          return ''
        }
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  // 获取歌词对象
  getLyricMap(lrc) {
    let key, value, sIdx, eIdx, nsIdx
    let ret = {}
    if (!lrc || (typeof lrc !== 'string')) return ret

    while (lrc) {
      sIdx = lrc.indexOf('[')
      eIdx = lrc.indexOf(']') + 1
      if (sIdx !== -1 && eIdx !== -1) {
        key = lrc.slice(sIdx, eIdx)
        advance(eIdx)
        nsIdx = lrc.indexOf('[')
        value = lrc.slice(0, nsIdx)
        if (/^\[(\d+):(\d+)\.(\d+)/.test(key) && value.trim() !== '') {
          ret[key] = value.trim()
        }
        advance(nsIdx)
      } else {
        break
      }
    }

    function advance(n) {
      lrc = lrc.substring(n)
    }
    return ret
  }

  convertProp(obj) {
    Object.keys(obj).forEach((str) => {
      if (!obj[str]) {
        delete obj[str]
      } else {
        let prop = f(str)
        if (prop || prop === 0) {
          obj[prop] = obj[str]
        }
        delete obj[str]
      }
    })

    function f(str) {
      str = str.match(/^\[(\d+):(\d+)\.(\d+)/)
      if (str) {
        return Number(str[1]) * 60 * 1000 + Number(str[2]) * 1000 + Number(str[3])
      } else {
        return null
      }
    }
    return obj
  }

  getCurPlayLyric(audioCurTime) {
    if (!this.isGoOn) return

    let audioCurTimeMs = audioCurTime * 1000
    let arrTime = Object.keys(this.finalLrcMap)

    let i = 0, len = arrTime.length, idx

    if (audioCurTimeMs === 0) {
      return {
        cur: v(this.finalLrcMap[arrTime[0]]),
        duration: parseInt(arrTime[1]) - parseInt(arrTime[0]),
        curIndex: 0
      }
    }
    if (audioCurTimeMs >= Number(arrTime[len - 1])) {
      return {
        cur: v(this.finalLrcMap[arrTime[len - 1]]),
        duration: parseInt(arrTime[len - 1]) - parseInt(arrTime[len - 2]),
        curIndex: len - 1
      }
    }
    for (; i < len; i++) {
      if (
        audioCurTimeMs >= Number(arrTime[i - 1]) &&
        audioCurTimeMs < Number(arrTime[i])
      ) {
        idx = i - 1
        break
      }
    }

    return {
      cur: v(this.finalLrcMap[arrTime[idx]]),
      duration: parseInt(arrTime[idx + 1]) - parseInt(arrTime[idx]),
      curIndex: idx
    }

    function v(val) {
      return typeof val === 'undefined' ? '' : val
    }
  }
}
