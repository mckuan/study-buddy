const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { unblockWebsites, blockWebsites } = require('./hosts');

let win;          
let checklistWin; 
let settingsWin;


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
}

ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow().minimize();
});

function createChecklistWindow() {
  const checklistState = windowStateKeeper({
    defaultWidth: 280,
    defaultHeight: 220,
    file: 'checklist-window-state.json'
  });

  checklistWin = new BrowserWindow({
    x: checklistState.x,
    y: checklistState.y,
    width: checklistState.width,
    height: checklistState.height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  checklistState.manage(checklistWin);
  checklistWin.loadFile('checklist.html');
  checklistWin.setIgnoreMouseEvents(false);
}

ipcMain.on('open-checklist', () => {
  createChecklistWindow();
});

ipcMain.on('close-checklist', () => {
  if (checklistWin && !checklistWin.isDestroyed()) {
    checklistWin.destroy();
    checklistWin = null;
  }
});

ipcMain.on('focus-main-window', () => {
  if (win) {
    win.focus();
  }
});

ipcMain.on('focus-checklist-window', () => {
  if (checklistWin) {
    checklistWin.focus();
  }
});


ipcMain.on('request-block', async () => {
  try{
    await blockWebsites();
  } catch (err) {
    console.error('blocking failed:', err);
  }
});

ipcMain.on('request-unblock', async () => {
  try{
    await unblockWebsites();
  } catch (err) {
    console.error('unblocking failed:', err);
  }
});

app.whenReady().then(createWindow);