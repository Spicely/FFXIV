// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const url = require('url')
global.electron = require('electron')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let trayInstance
let notifucationWindow

const isDev = process.env.NODE_ENV === 'development'
// const isDev = true
const port = parseInt(process.env.PORT, 10) || 3000

const devUrl = `http://localhost:${port}/`

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) { mainWindow.restore() }
            mainWindow.focus()
            mainWindow.show()
            mainWindow.setSkipTaskbar(true)
        }
    })
}

const prodUrl = url.format({
    pathname: path.resolve(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes: true
})
const indexUrl = isDev ? devUrl : prodUrl

const preUrl = url.format({
    pathname: path.resolve(__dirname, 'build/public/preload.js'),
    protocol: 'file:',
    slashes: true
})
const preloadUrl = isDev ? path.join(__dirname, './public/preload.js') : preUrl

function createWindow() {
    // Create the browser window.
    const { screen } = require('electron')
    const appIconPath = path.join(__dirname, './assets/FFVIX.png')
    const { height, width } = screen.getPrimaryDisplay().workAreaSize
    mainWindow = new BrowserWindow({
        width: 800,
        minWidth: 800,
        minHeight: 600,
        height: 600,
        frame: false,
        icon: appIconPath,
        title: 'FFXIV工具',
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: true, // 是否集成 Nodejs
            // webSecurity: false,
            preload: preloadUrl// 但预加载的 js 文件内仍可以使用 Nodejs 的 API
        }
    })

    notifucationWindow = new BrowserWindow({
        width: 400,
        height,
        x: width - 400,
        y: 0,
        title: '提示窗口',
        frame: false,
        icon: appIconPath,
        skipTaskbar: true,
        titleBarStyle: 'hiddenInset',
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: true,
        }
    })

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出', click: () => {
                mainWindow = null;
                app.quit()
            }
        },
    ])

    trayInstance = new Tray(nativeImage.createFromPath(appIconPath))
    trayInstance.setToolTip('FFXIV工具')
    trayInstance.setContextMenu(contextMenu)
    trayInstance.on('double-click', function () {
        mainWindow.show()
        mainWindow.setSkipTaskbar(false)
    })

    ipcMain.on('notificationMain', (event, message) => {
        notifucationWindow.webContents.send('notification', message)
    })

    ipcMain.on('notificationMainClose', (event, message) => {
        notifucationWindow.webContents.send('notificationClose', message)
    })

    ipcMain.on('notificationTime', (event, message) => {
        notifucationWindow.webContents.send('notificationTime', message)
    })

    ipcMain.on('min', () => mainWindow.minimize())
    ipcMain.on('max', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow.maximize()
        }
    })

    ipcMain.on('close', (event) => {
        mainWindow.hide()
        mainWindow.setSkipTaskbar(true)
        event.preventDefault()
    })

    app.on('window-all-closed', () => {
        app.quit()
    })

    mainWindow.loadURL(indexUrl)
    notifucationWindow.loadURL(isDev ? `${indexUrl}/#/notification` : `${indexUrl}?/#/notification`)

    notifucationWindow.setIgnoreMouseEvents(true)

    if (isDev) {
        mainWindow.webContents.openDevTools()
        // notifucationWindow.webContents.openDevTools()
    }

    mainWindow.on('close', function (event) {
        mainWindow.hide()
        mainWindow.setSkipTaskbar(true)
        event.preventDefault()
    })

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    notifucationWindow.on('closed', function () {
        notifucationWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.