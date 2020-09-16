/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */

// import path from 'path';
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import Store from './backend/common/store-manager/store';

// start set custom params
const backendStore: Store = Store.getStore();
const env = (backendStore.get('env') || 'production').toUpperCase();
Object.keys(process.env).forEach(param => {
  if (param.startsWith(`${env}_`)) {
    const key = param.replace(`${env}_`, '');
    process.env[key] = process.env[param];
    delete process.env[`STAGE_${key}`];
    delete process.env[`PRODUCTION_${key}`];
  }
});
// end set custom params

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async (downloadsDir) => {
  const width = 1366;
  const height = 790;

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    // webPreferences:
    //   (process.env.NODE_ENV === 'development' ||
    //     process.env.E2E_BUILD === 'true') &&
    //   process.env.ERB_SECURE !== 'true'
    //     ? {
    //         nodeIntegration: true,
    //       }
    //     : {
    //         preload: path.join(__dirname, 'dist/renderer.prod.js'),
    //       },
  });

  mainWindow.setMinimumSize(width, height);

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL(`file://${__dirname}/app.html?dwldir=${downloadsDir}`);

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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  createWindow(app.getPath('downloads'));
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow(app.getPath('downloads'));
});
