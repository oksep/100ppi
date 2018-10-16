import {MenuItemConstructorOptions, Accelerator} from 'electron';

import * as isDev from 'electron-is-dev';

/**
 * Creates a default menu for electron apps
 *
 * @param {Object} app electron.app
 * @param {Object} shell electron.shell
 * @returns {Object}  a menu object to be passed to electron.Menu
 */

export default function (app, shell): MenuItemConstructorOptions[] {

    const template: MenuItemConstructorOptions[] = [
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					role: 'undo',
				},
				{
					label: 'Redo',
					accelerator: 'Shift+CmdOrCtrl+Z',
					role: 'redo',
				},
				{
					type: 'separator',
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					role: 'cut',
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					role: 'copy',
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					role: 'paste',
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectall',
				},
			],
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R' as Accelerator,
					click: (item, focusedWindow) => {
						if (focusedWindow) {
							focusedWindow.reload();
						}
					},
				},
				{
					label: 'Toggle Full Screen',
					accelerator: (process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11') as Accelerator,
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
						}
					},
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: (process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I') as Accelerator,
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.toggleDevTools();
						}
					},
				},
			],
		},
		{
			label: 'Window',
			role: 'window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'CmdOrCtrl+M' as Accelerator,
					role: 'minimize',
				},
				{
					label: 'Close',
					accelerator: 'CmdOrCtrl+W' as Accelerator,
					role: 'close',
				},
			],
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click() {
						shell.openExternal('http://www.septenary.cn');
					},
				},
			],
		}
    ];

	if (!isDev) {
		(template[1].submenu as Array<any>).pop();
	}

    if (process.platform === 'darwin') {
        const name = app.getName();
        const m = {
            label: name,
            submenu: [
                {
                    label: 'About ' + name,
                    role: 'about',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: [],
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Hide ' + name,
                    accelerator: 'Command+H',
                    role: 'hide',
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    role: 'hideothers',
                },
                {
                    label: 'Show All',
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click() {
                        app.quit();
                    },
                },
            ],
        };
        template.unshift(m as any);
        const windowMenu = template.find(function (m: any) {
            return 'window' === m.role;
        });

        (windowMenu.submenu as MenuItemConstructorOptions[]).push(
            {
                type: 'separator',
            },
            {
                label: 'Bring All to Front',
                role: 'front',
            },
        );
    }

    return template;
}
