"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const travel_1 = require("./travel/travel");
const electron_1 = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");
const menu_1 = require("./menu");
let win;
function createWindow() {
    const option = {
        width: 920,
        height: 750,
        minWidth: 930,
        minHeight: 500,
        backgroundColor: '#fff',
        frame: false,
        titleBarStyle: 'hidden',
    };
    win = new electron_1.BrowserWindow(option);
    if (isDev) {
        win.loadURL('http://127.0.0.1:8080');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../render/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }
    win.on('closed', () => {
        win = null;
    });
}
electron_1.app.on('ready', () => {
    // Get template for default menu
    const menu = menu_1.default(electron_1.app, electron_1.shell);
    // Set top-level application menu, using modified template
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(menu));
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
});
electron_1.app.on('activate', () => {
    if (win == null) {
        createWindow();
    }
});
electron_1.ipcMain.on('request-start-crawler', (event, arg) => {
    travel_1.startCrawler();
});
//# sourceMappingURL=index.js.map