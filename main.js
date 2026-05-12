const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');

function createWindow() {
  const windowState = windowStateKeeper({
    defaultWidth: 420,
    defaultHeight: 280
  });

  const win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  windowState.manage(win);
  win.loadFile('index.html');
  win.setIgnoreMouseEvents(false);
}

ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow().minimize();
});

app.whenReady().then(createWindow);