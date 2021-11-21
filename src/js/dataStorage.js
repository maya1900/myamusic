import store from '../store/index.js'
const localDataKey = 'vue-player-data'

export default {

  getAppData() {

    let unparsedLocalData = localStorage.getItem(localDataKey)
    let parsedLocalData = unparsedLocalData ? JSON.parse(unparsedLocalData) : {}

    return { ...store.state, ...parsedLocalData }

  },

  setAppData() {

    if (arguments.length === 1) {
      let appData = { ...arguments[0] }
      delete appData.tempStatus
      localStorage.setItem(localDataKey, JSON.stringify(appData))
    } else {
      let localData = this.getAppData()
      localData[arguments[0]] = arguments[1]
      localStorage.setItem(localDataKey, JSON.stringify(localData))
    }

  }

}
