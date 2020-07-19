import electron from 'electron';
// import { createAppWindow } from '../../main.dev';

let win = null;
const { BrowserWindow } = electron.remote;

export const createAuthWindow = (auth, socialAppName, callBack) => {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  win.loadURL(auth.getAuthenticationURL(socialAppName));

  const {
    session: { webRequest },
  } = win.webContents;

  const filter = {
    urls: ['http://localhost/callback*'],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    const tokensResponse = await auth.loadTokens(url);
    await callBack(tokensResponse);
    return destroyAuthWin();
  });

  if (win) {
    win.on('authenticated', () => {
      destroyAuthWin();
    });
    win.on('closed', () => {
      win = null;
    });
  }
};

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

export const createLogoutWindow = (auth) => {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(auth.getLogOutUrl());

  logoutWindow.on('ready-to-show', async () => {
    logoutWindow.close();
    await auth.logout();
  });
};
