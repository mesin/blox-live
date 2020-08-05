import electron from 'electron';

const { BrowserWindow } = electron.remote;

export function createLogoutWindow(logOutUrl) {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(logOutUrl);

  logoutWindow.on('ready-to-show', async () => {
    logoutWindow.close();
  });
}
