/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import LiveChatManager from './LiveChatManager';
import { IpcMainEvent } from 'electron/main';
import { spawn } from 'child_process';
import PortAllocator from './utils/portAllocator';
import SocketManager from './services/SocketManager';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

let mainWindow: BrowserWindow | null = null;
let liveChatManager: LiveChatManager | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
  });

  liveChatManager = new LiveChatManager(
    getAssetPath('./configs/config.json'),
    getAssetPath('./configs/commands.json'),
    mainWindow
  );

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (liveChatManager) liveChatManager.clear();
  SocketManager.getInstance().close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    let portAllocator = PortAllocator.getInstance();
    const port = await portAllocator.getPort();
    SocketManager.getInstance(`http://localhost:${port}`);

    ipcMain.on('get-port-number', (event, _arg) => {
      event.returnValue = port;
    });

    // run python
    if (process.env.NODE_ENV === 'development') {
      spawn(`python ./backend/webserver/app.py ${port}`, {
        detached: true,
        shell: true,
        stdio: 'inherit',
      });
    } else {
      let runFlask: any = {
        win32: 'start ' + getAssetPath('./scripts/dist/app/app.exe'),
      };

      if (process.platform in runFlask) {
        runFlask = runFlask[process.platform];
        spawn(`${runFlask} ${port}`, {
          detached: false,
          shell: true,
          stdio: 'pipe',
        });
      }
    }

    createWindow();
  })
  .catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('livechat:start', (_: IpcMainEvent) => {
  liveChatManager?.start();
});

ipcMain.on('livechat:stop', (_: IpcMainEvent) => {
  liveChatManager?.close();
});

ipcMain.on('system:reload', (_: IpcMainEvent) => {
  liveChatManager?.reload();
});
