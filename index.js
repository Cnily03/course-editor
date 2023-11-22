const { app, BrowserWindow, protocol, net } = require('electron')
const path = require('path')
const fs = require('fs')
const { pathToFileURL, fileURLToPath } = require('url')
const isDev = process.env.NODE_ENV?.trim() === 'development'
const { menu } = require('./electron/menu.js')
const { askQuit } = require('./electron/event.js')

global.quit = true
global.app = app

require("./electron/ipc-main-event.js")

// Register protocol
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'cceditor',
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
        }
    }
])

app.whenReady().then(() => {
    protocol.handle('cceditor', req => {
        const { host, pathname, searchParams } = new URL(req.url)
        if (host === "static") { // Root directory of installed app
            return new Promise(resolve => {
                fs.readFile(path.join(path.dirname(app.getPath('exe')), pathname), (err, data) => {
                    if (err) resolve(new Response('', {
                        status: 404,
                        headers: isDev ? {
                            'X-Error': err.message
                        } : {},
                        statusText: 'Not Found'
                    }))
                    resolve(new Response(data))
                })
            })
        }
        if (host === "bundle") { // asar
            // DEV: vue hot server
            if (isDev && pathname.startsWith('/web')) {
                return net.fetch(`http://localhost:3000${pathname}`, {
                    method: req.method,
                    headers: req.headers,
                    body: req.body
                })
            }
            return new Promise(resolve => {
                fs.readFile(path.join(__dirname, pathname), (err, data) => {
                    if (err) resolve(new Response('', {
                        status: 404,
                        headers: {
                            'X-Error': err.message
                        },
                        statusText: 'Not Found'
                    }))
                    resolve(new Response(data))
                })
            })
        }
    })

    // Create a window
    const win = new BrowserWindow({
        width: 1920 * 0.7,
        height: 1080 * 0.7,
        icon: path.resolve(__dirname, './web/favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, './electron/preload.js'),
            webSecurity: isDev ? false : true, // Dev 环境关闭跨域限制
        }
    })

    global.win = win

    win.on('close', (e) => {
        if (global.quit) return
        e.preventDefault()
        askQuit()
    })

    win.setMenu(menu)

    // DEV: 默认打开开发者工具
    if (isDev) win.webContents.openDevTools()

    // Load main page
    win.loadURL('cceditor://bundle/web/index.html')
})