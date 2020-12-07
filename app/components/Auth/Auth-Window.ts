import electron from 'electron';

let win = null;
const { BrowserWindow } = electron.remote;

export const createAuthWindow = async (auth, socialAppName, onSuccess, onFailure) => {
  destroyAuthWin();

  let finishedAuthentication = false;

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  const userAgent = 'Chrome';
  win.loadURL(auth.getAuthenticationURL(socialAppName), { userAgent });

  const { session: { webRequest } } = win.webContents;
  const filter = { urls: ['file:///callback*'] };

  const listener = async ({ url }) => { // url returns code
    const tokensResponse = await auth.loadAuthToken(url);
    await onSuccess(tokensResponse);
    finishedAuthentication = true;
    return destroyAuthWin();
  };

  webRequest.onBeforeRequest(filter, listener);

  if (win) {
    win.on('authenticated', () => {
      destroyAuthWin();
    });
    win.on('closed', () => {
      if (!finishedAuthentication) {
        onFailure();
      }
      win = null;
    });
  }
};

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}
