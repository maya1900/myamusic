'use strict'

import { app, protocol, BrowserWindow, dialog, Tray, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'
const { ipcMain } = require("electron");
// eslint-disable-next-line no-undef
const iconPath = path.join(__static, 'favicon.ico')
let win, tray;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 无边框
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false  // 重要突破audio不能播放本地音乐的限制！！！
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // console.log(iconPath);
  tray = new Tray(iconPath)
  tray.setToolTip('极简音乐')
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => app.quit()
      }
    ])
    tray.popUpContextMenu(menuConfig)
  })
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

ipcMain.on("close", () => {
  win.close();
  app.quit();
});
ipcMain.on("minimize", () => {
  win.hide();
});

// 添加窗口发来的信息：打开文件夹去选择音乐
ipcMain.on('open-music-file', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Music', extensions: ['mp3', 'flac', 'm4a'] }]
  }).then((res) => {
    // 拿到结果
    const { canceled, filePaths } = res
    if (!canceled && filePaths.length) {
      event.sender.send('selected-file', filePaths)
    }
  }).catch(() => {
    // 错误
  })
})

ipcMain.on('open-music-folder', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(res => {
    // console.log(res);
    const { canceled, filePaths } = res
    if (!canceled && filePaths.length) {
      event.sender.send('selected-folder', filePaths)
    }
  })
})


if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

