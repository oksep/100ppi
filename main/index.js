"use strict";
// import {startCrawler} from './travel/travel';
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const travel_1 = require("./travel/travel");
const path = require('path');
const debug = /--debug/.test(process.argv[2]);
if (process.mas)
    electron_1.app.setName('Electron APIs');
let mainWindow = null;
function initialize() {
    let shouldQuit = makeSingleInstance();
    if (shouldQuit)
        return electron_1.app.quit();
    function createWindow() {
        const windowOptions = {
            width: 650,
            height: 600,
            title: '100ppi',
            resizable: false,
            fullscreenable: false
        };
        mainWindow = new electron_1.BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, '../render/index.html'));
        // Launch fullscreen with DevTools open, usage: npm run debug
        if (debug) {
            // mainWindow.webContents.openDevTools();
            // mainWindow.maximize();
        }
        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    }
    electron_1.app.on('ready', function () {
        createWindow();
    });
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        if (mainWindow === null) {
            createWindow();
        }
    });
}
// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas)
        return false;
    return electron_1.app.makeSingleInstance(function () {
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
}
initialize();
electron_1.ipcMain.on('request-travel', (event, arg) => {
    travel_1.startTravel(arg, (msg, current, total) => {
        const remain = current - 1;
        event.sender.send('response-request-travel', { msg, remain, total });
    });
});
//# sourceMappingURL=index.js.map