const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

  // window controls (render.js)
  minimize: () => ipcRenderer.send('minimize-window'),
  openChecklist: () => ipcRenderer.send('open-checklist'),
  closeChecklist: () => ipcRenderer.send('close-checklist'),
  focusChecklist: () => ipcRenderer.send('focus-checklist-window'),

  // room (invite.js, room.js)
  openRoom: (data) => ipcRenderer.send('open-room', data),
  leaveRoom: () => ipcRenderer.send('leave-room'),

  // blocking (timer.js, room.js)
  requestBlock: () => ipcRenderer.send('timer-request-block'),
  requestUnblock: () => ipcRenderer.send('timer-request-unblock'),

  // player (room.js, select.js)
  getPlayerName: () => ipcRenderer.invoke('get-player-name'),
  setPlayerName: (name) => ipcRenderer.send('set-player-name', name),

  // cat (cat.js, select.js)
  getCatShape: () => ipcRenderer.invoke('get-cat-shape'),
  getCatColor: () => ipcRenderer.invoke('get-cat-color'),
  getCollarColor: () => ipcRenderer.invoke('get-collar-color'),
  setCatShape: (shape) => ipcRenderer.send('set-cat-shape', shape),
  setCatColor: (color) => ipcRenderer.send('set-cat-color', color),
  setCollarColor: (color) => ipcRenderer.send('set-collar-color', color),

  // settings (settings.js)
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
  toggleAlwaysOnTop: (enabled) => ipcRenderer.send('toggle-always-on-top', { enabled }),
  getBlockingEnabled: () => ipcRenderer.invoke('get-blocking-enabled'),
  toggleBlocking: (enabled) => ipcRenderer.send('settings-toggle-blocking', { enabled }),
  getBlockedSites: () => ipcRenderer.invoke('get-blocked-sites'),
  updateBlockedSites: (sites) => ipcRenderer.send('update-blocked-sites', sites),

  // first time check (render.js)
  getFirstTime: () => ipcRenderer.invoke('get-first-time'),
  setFirstTime: (value) => ipcRenderer.send('set-first-time', value),
  
  //checklist (checklist-render.js)
  getChecklist: () => ipcRenderer.invoke('get-checklist'),
  getCompletelist: () => ipcRenderer.invoke('get-completelist'),
  saveChecklist: (data) => ipcRenderer.send('save-checklist', data),

  // listeners — for replies back from main (settings.js, render.js)
  on: (channel, callback) => {
    const allowed = [
      'checklist-closed',
      'blocking-enabled-state',
      'settings-toggle-success',
      'settings-toggle-failed'
    ];
    if (allowed.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    }
  }

});