const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { unblockWebsites, blockWebsites, getBlockingEnabled, 
  setBlockingEnabled, setBlockedSites } = require('./hosts');
let{blocksites} = require('./hosts');

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

ipcMain.on('get-blocking-enabled', (event) => {
  event.reply('blocking-enabled-state', { enabled: getBlockingEnabled() });
});


ipcMain.on('request-block', async (event) => {
  try {
    await blockWebsites();
    event.reply('toggle-block-success');
  } catch (err) {
    console.error('Blocking failed:', err);
    event.reply('toggle-block-failed', { wrongPassword: err.message === 'wrong-password' });
  }
});
 
ipcMain.on('request-unblock', async () => {
  try {
    await unblockWebsites();
  } catch (err) {
    console.error('Unblocking failed:', err);
  }
});
 
ipcMain.on('set-blocking-enabled', async (event, { enabled, sites }) => {
  if (sites) setBlockedSites(sites);
  const result = await setBlockingEnabled(enabled);
  if (result === 'wrong-password') {
    event.reply('toggle-block-failed', { wrongPassword: true });
  } else if (result === 'cancelled') {
    event.reply('toggle-block-failed', { wrongPassword: false });
  }
});
 
app.whenReady().then(createWindow);
 