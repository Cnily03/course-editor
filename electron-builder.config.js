const isDev = process.env.NODE_ENV?.trim() === "development"

const APP_NAME = "CCEditor"
const icon_path = "electron/assets/icon.ico"

module.exports = {
    productName: APP_NAME,
    appId: "wang.jevon.course.cceditor",
    directories: {
        output: "electron-build"
    },
    asar: true,
    npmRebuild: isDev ? false : true,
    files: [
        'web/**/*',
        'electron/**/*',
        "index.js",
        "!**/node_modules/**/*",
        "node_modules/mime/**/*",
    ],
    extraResources: [{
        from: icon_path,
        to: `../${APP_NAME}.ico`
    }],
    win: {
        icon: icon_path,
        target: {
            target: "nsis",
            arch: [
                "x64",
                // "ia32"
            ]
        }
    }
}