const { ipcRenderer } = require('electron');

const frame = document.querySelector('.frame');
const content = document.querySelector('.content');
const closebutton = document.querySelector('.close-btn');
const minimizebutton = document.querySelector('.minimize-btn');
const checklistbutton = document.querySelector('.checklist-btn');

let checklistOpen = false;

// ---------------- FRAME ----------------

frame.addEventListener('mouseover', (e) => {
  if (e.target === frame) {
    frame.style.backgroundColor = 'rgba(91, 90, 90, 0.54)';
    closebutton.style.backgroundColor = 'red';
    minimizebutton.style.backgroundColor = 'yellow';
    closebutton.style.color = 'black';
    minimizebutton.style.color = 'black';
  }
});

frame.addEventListener('mouseout', (e) => {
  if (!frame.contains(e.relatedTarget)) {
    frame.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    closebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    minimizebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    closebutton.style.color = 'transparent';
    minimizebutton.style.color = 'transparent';
  }
});

// ---------------- WINDOW CONTROLS ----------------

closebutton.addEventListener('click', () => {
  ipcRenderer.send('close-checklist');
  window.close();
});

minimizebutton.addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

checklistbutton.addEventListener('click', () => {
  if (!checklistOpen) {
    ipcRenderer.send('open-checklist');
    checklistOpen = true;
  } else {
    ipcRenderer.send('close-checklist');
    checklistOpen = false;
  }
});

ipcRenderer.on('checklist-closed', () => {
  checklistOpen = false;
});

