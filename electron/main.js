const { app, BrowserWindow } = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('node:path')

const NODE_ENV = process.env.NODE_ENV  //新增
// const NODE_ENV = 'development'  // 判断开发或生产模式(建议写成这种,开发模式就可以用,等即将打包了再把这个变量换成打包模式)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // win.loadURL('http://localhost:8080/') // 测试
  // win.loadFile('dist/index.html') // 测试

  win.loadURL(
    NODE_ENV === 'development'
    ? 'http://localhost:8080'
    :`file://${path.join(__dirname, '../dist/index.html')}`
  ); // 新增
  // 打开开发工具
  if (NODE_ENV === "development") {
    win.webContents.openDevTools()
  } // 新增
}

// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。
app.whenReady().then(() => {
  createWindow()
  // 当 Linux 和 Windows 应用在没有窗口打开时退出了，
  // macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，
  // 并且在没有窗口可用的情况下激活应用时会打开新的窗口。
  // 这里统一处理
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// win、macos、linux 统一关闭
// 需要监听 app 模块的 'window-all-closed' 事件。如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
