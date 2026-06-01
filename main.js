const originalEmit = process.emit;
process.emit = function(event, warning) {
  if (event === 'warning' && warning?.message?.includes('textured')) return false;
  return originalEmit.apply(process, arguments);
};

const { app, BrowserWindow, ipcMain, } = require('electron');
const Store = require('electron-store');
const store = new Store();
const windowStateKeeper = require('electron-window-state');
const {
  blockWebsites, unblockWebsites,
  getBlockingEnabled, getBlockedSites,
  setBlockingEnabled, setBlockedSites,
} = require('./hosts');

let alwaysOnTopEnabled = store.get('alwaysOnTop', false);
let win;
let checklistWin;
let roomWin;
let catcolor = 'orange';
let catshape = 'fluffy';
let collarcolor = 'red';
let name = store.get('playerName', '');

// ── window creation ───────────────────────────────────────

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
  windowOnTop(alwaysOnTopEnabled, win);
}

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
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  checklistState.manage(checklistWin);
  checklistWin.loadFile('checklist.html');
  checklistWin.setIgnoreMouseEvents(false);
  checklistWin.setAlwaysOnTop(true, 'screen-saver');
  windowOnTop(alwaysOnTopEnabled, checklistWin);

  checklistWin.once('ready-to-show', () => {
    checklistWin.show();
    // Keep focus on main window so checklist button stays responsive
    win.focus();
  });

  checklistWin.on('closed', () => {
    win.webContents.send('checklist-closed');
    checklistWin = null;
  });
}

function createRoomWindow(x, y, name, code, creator) {
  roomWin = new BrowserWindow({
    x,
    y,
    width: 400,
    height: 250,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const params = new URLSearchParams({ name, code: code || '', creator });
  roomWin.loadFile('room.html', { search: params.toString() });
  roomWin.setIgnoreMouseEvents(false);
  roomWin.setAlwaysOnTop(true, 'screen-saver');

  roomWin.on('closed', () => {
    win.setPosition(x, y);
    win.show();
    roomWin = null;
  });
  windowOnTop(alwaysOnTopEnabled, roomWin);
}

function windowOnTop(alwaysOnTopEnabled, win){
  if (alwaysOnTopEnabled) {
    win.setAlwaysOnTop(true, 'screen-saver', 1);
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  } else {
    win.setAlwaysOnTop(false);
    win.setVisibleOnAllWorkspaces(false);
  }
}

// ── window controls ───────────────────────────────────────

ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('open-checklist', () => {
  if (checklistWin && !checklistWin.isDestroyed()) {
    checklistWin.destroy();
    checklistWin = null;
    win.focus();
  } else {
    createChecklistWindow();
  }
});

ipcMain.on('close-checklist', () => {
  if (checklistWin && !checklistWin.isDestroyed()) {
    checklistWin.destroy();
    checklistWin = null;
  }
  win.focus();
});

ipcMain.on('focus-main-window', () => {
  win?.focus();
});

ipcMain.on('focus-checklist-window', () => {
  checklistWin?.focus();
});

ipcMain.on('open-room', (event, { name, code, creator }) => {
  const [x, y] = win.getPosition();
  win.hide();
  createRoomWindow(x, y, name, code, creator);
});

ipcMain.on('leave-room', () => {
  if (roomWin && !roomWin.isDestroyed()) {
    roomWin.close();
  }
});

// ── settings ──────────────────────────────────────────────

ipcMain.on('get-blocking-enabled', (event) => {
  event.reply('blocking-enabled-state', { enabled: getBlockingEnabled() });
});

ipcMain.on('settings-toggle-blocking', async (event, { enabled }) => {
  const result = await setBlockingEnabled(enabled);
  if (result === 'ok') {
    event.reply('settings-toggle-success', { enabled });
  } else {
    event.reply('settings-toggle-failed', { wrongPassword: result === 'wrong-password' });
  }
});

ipcMain.handle('get-blocked-sites', () => {
  return getBlockedSites();
});

ipcMain.on('update-blocked-sites', (event, sites) => {
  setBlockedSites(sites);
});

ipcMain.handle('get-always-on-top', () => {
  return alwaysOnTopEnabled;
});

ipcMain.on('toggle-always-on-top', (event, { enabled }) => {
  store.set('alwaysOnTop', enabled);
  if (enabled) {
    alwaysOnTopEnabled = true;
    windowOnTop(alwaysOnTopEnabled, win);
  } else {
    alwaysOnTopEnabled = false;
    windowOnTop(alwaysOnTopEnabled, win);
  }
});

// ── timer blocking ────────────────────────────────────────

ipcMain.on('timer-request-block', async () => {
  try {
    await blockWebsites();
  } catch (err) {
    console.error('Blocking failed:', err);
  }
});

ipcMain.on('timer-request-unblock', async () => {
  try {
    await unblockWebsites();
  } catch (err) {
    console.error('Unblocking failed:', err);
  }
});

// ── cat skins ─────────────────────────────────────────────

ipcMain.handle('get-cat-color', () => catcolor);

ipcMain.handle('get-cat-shape', () => catshape);

ipcMain.handle('get-collar-color', () => collarcolor);

ipcMain.on('set-cat-color', (event, color) => {
  catcolor = color;
});

ipcMain.on('set-cat-shape', (event, shape) => {
  catshape = shape;
});

ipcMain.on('set-collar-color', (event, color) => {
  collarcolor = color;
});

ipcMain.on('set-player-name', (event, name) => {
  store.set('playerName', name);
});

ipcMain.handle('get-player-name', () => {
  return name;
});

// ── app ───────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow();
});