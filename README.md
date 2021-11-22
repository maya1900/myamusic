# myamusic

[![IvGGPs.png](https://z3.ax1x.com/2021/11/21/IvGGPs.png)](https://imgtu.com/i/IvGGPs)

## 安装

```js
npm i
```

## 运行

```js
npm start
```

## 打包

```js
npm run starting
```

## 说明

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

## 遇到的问题

### 1.  搭建electron项目

这里先创建vue项目，再使用vue-cli-plugin-electron-builder完成的，完成后直接npm run electron:serve即可直接启动应用，不用先启动vue，再启动electron。

### 2. 设置应用无边框

在background.js，new BrowserWindow时options里添加frame: false即可

### 3. 添加本地文件、文件夹，获取音乐内容

点击事件时使用渲染进程ipcRenderer调用主进程ipcMain,主进程里接收事件，打开文件选择框选择文件/文件夹，在option里设置，回调函数为文件路径，使用jsmediatags来处理得到音乐信息；

### 4. audio播放本地音乐

audio标签因为浏览器的限制，不能播放本地音频，需要在new BrowserWindow时设置webSecurity为false,或者html里给audio标签加入属性crossOrigin为true

### 5. 查找歌词、歌词同步

找到相同目录下相同名称的.lrc文件，使用fs模块来读取文件，再进行数据处理

### 6. 设置托盘

main.js里new Tray托盘，设置好对应事件即可

### 7. 打包失败

里面有几个资源是下载github的比较慢，可以查看报错信息找到相应资源地址下载后放到**C:\Users\Administrator\AppData\Local\electron\Cache** 目录下；

不是资源问题，删掉node_modules，重新npm i；

将项目上传至github再进行打包

### 8. 打包成功应用白屏

去掉vue router下的mode: history；

检查项目里的各个路径是否正确，是否英文

### 9.  打包后图标问题

图标放在build/icons目录下，不小于256x256，png/icns/ico,在线生成图标地址：[PNG to ICNS | CloudConvert](https://cloudconvert.com/png-to-icns)

开发环境没问题，打包后图标消失。把图标放在publick文件目录下，使用```path.join(__static, 'favicon.ico')```， __static为静态目录

### 10.  打包前的配置

使用这个插件配置还是在vue.config.js中进行配置(参考)：

```js

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
            "productName":"xxxx",//项目名 这也是生成的exe文件的前缀名
            "appId": "xxxxx",//包名  
            "copyright":"xxxx",//版权  信息
            "compression": "store", // "store" | "normal"| "maximum" 打包压缩情况(store 相对较快)，store 39749kb, maximum 39186kb
            "directories": {
                "output": "build" // 输出文件夹
            }, 
            "asar": false, // asar打包
            "extraResources":  { // 拷贝dll等静态文件到指定位置
                "from": "./app-update.yml",
                "to": "./b.txt"
            },
            "win": {  
                "icon": "xxx/icon.ico"//图标路径,
                "extraResources":  { // 拷贝dll等静态文件到指定位置(用于某个系统配置)
                    "from": "./app-update.yml",
                    "to": "./b.txt"
                }
            },
            "nsis": {
                "oneClick": false, // 一键安装
                "guid": "xxxx", //注册表名字，不推荐修改
                "perMachine": true, // 是否开启安装时权限限制（此电脑或当前用户）
                "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                "allowToChangeInstallationDirectory": true, // 允许修改安装目录
                "installerIcon": "./build/icons/aaa.ico", // 安装图标
                "uninstallerIcon": "./build/icons/bbb.ico", //卸载图标
                "installerHeaderIcon": "./build/icons/aaa.ico", // 安装时头部图标
                "createDesktopShortcut": true, // 创建桌面图标
                "createStartMenuShortcut": true, // 创建开始菜单图标
                "shortcutName": "xxxx" // 图标名称
            }
      }
    }
  }
}
```



