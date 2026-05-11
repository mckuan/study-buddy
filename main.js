const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 250,
    transparent: false,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    frame: true,
    thickFrame: true,
    frameColor: '#000000ff',
    alwaysOnTop: true,
    alwaysOnLeft: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);