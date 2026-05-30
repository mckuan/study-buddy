const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { unblockWebsites, blockWebsites, getBlockingEnabled, getBlockedSites,
  setBlockingEnabled, setBlockedSites } = require('./hosts');

function createWindow() {
  const windowState = windowStateKeeper({
    defaultWidth: 420,
    defaultHeight: 280
  });

  win = new BrowserWindow({ 
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
  win.setAlwaysOnTop(true, 'screen-saver');
}

app.whenReady().then(createWindow);