const { ipcRenderer } = require('electron');

const frame = document.querySelector('.frame');
const content = document.querySelector('.content');
const closebutton = document.querySelector('.close-btn');
const minimizebutton = document.querySelector('.minimize-btn');
const checklistbutton = document.querySelector('.checklist-btn');
let checklistOpen = false;

frame.addEventListener('mouseover', (e) => {
  if (e.target === frame) {
    frame.style.backgroundColor = 'rgba(91, 90, 90, 0.54)';
    closebutton.style.backgroundColor = 'red';
    minimizebutton.style.backgroundColor = 'yellow';
    closebutton.style.color = 'black';
    minimizebutton.style.color = 'black';
  } else if (e.target === content) {
    frame.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    closebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    minimizebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    closebutton.style.color = 'rgba(0,0,0,0.01)';
    minimizebutton.style.color = 'rgba(0,0,0,0.01)';
  }
});

frame.addEventListener('mouseout', (e) => {
  if (!frame.contains(e.relatedTarget)) {
    frame.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    closebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    minimizebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
    closebutton.style.color = 'rgba(0,0,0,0.01)';
    minimizebutton.style.color = 'rgba(0,0,0,0.01)';
  }
});


frame.addEventListener('click', (e) => {
  if (e.target === closebutton) {
    ipcRenderer.send('close-checklist');
    checklistOpen = false;
    window.close();
  } else if (e.target === minimizebutton) {
    ipcRenderer.send('minimize-window');
  } else if (e.target === checklistbutton) {
    e.stopPropagation(); 
    if (!checklistOpen) {
      ipcRenderer.send('open-checklist');
      checklistOpen = true;
    } else {
      ipcRenderer.send('close-checklist');
      checklistOpen = false;
    }
  }
});


ipcRenderer.on('checklist-closed', () => {
  checklistOpen = false;
});
