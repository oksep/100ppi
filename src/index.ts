// import {startCrawler} from './travel/travel';

import {app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu, shell} from 'electron';
import {startTravel} from "./travel/travel";

const path = require('path');

const debug = /--debug/.test(process.argv[2]);

if (process.mas) app.setName('Electron APIs');

let mainWindow = null;

function initialize() {
	let shouldQuit = makeSingleInstance();
	if (shouldQuit) return app.quit();

	function createWindow() {
		const windowOptions = {
			width: 650,
			height: 600,
			title: '100ppi',
			resizable: false,
			fullscreenable: false
		};

		mainWindow = new BrowserWindow(windowOptions);
		mainWindow.loadURL(path.join('file://', __dirname, '../render/index.html'));

		// Launch fullscreen with DevTools open, usage: npm run debug
		if (debug) {
			// mainWindow.webContents.openDevTools();
			// mainWindow.maximize();
		}

		mainWindow.on('closed', function () {
			mainWindow = null
		})
	}

	app.on('ready', function () {
		createWindow();
	});

	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	});

	app.on('activate', function () {
		if (mainWindow === null) {
			createWindow()
		}
	})
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
	if (process.mas) return false;

	return app.makeSingleInstance(function () {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus()
		}
	})
}

initialize();

ipcMain.on('request-travel', (event, arg) => {
	startTravel(arg, (msg, remain, total) => {
		event.sender.send('response-request-travel', {msg, remain, total});
	});
});
