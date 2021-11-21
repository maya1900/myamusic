
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "appId": "com.myaMusic.app",
        "productName": "myaMusic",
        "copyright": "Copyright @ 2021",
        "directories": {
          "output": "./dist"
        },
        "win": {
          "target": ["nsis"]
        },
        "nsis": {
          "oneClick": false,    //可单击打开
          "allowToChangeInstallationDirectory": true,    //允许用户选择安装位置
          "perMachine": true
        }
      }
    }
  }
}
