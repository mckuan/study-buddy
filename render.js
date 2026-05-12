const { ipcRenderer } = require('electron');

const frame = document.querySelector('.frame');
const content = document.querySelector('.content');
const closebutton = document.querySelector('.close-btn');
const minimizebutton = document.querySelector('.minimize-btn');

frame.addEventListener('mouseover', (e) => {
  if (e.target === frame) {
    frame.style.backgroundColor = 'rgba(91, 90, 90, 0.54)'; // blue on frame edges
    closebutton.style.backgroundColor = 'red'; // red on close button
    minimizebutton.style.backgroundColor = 'yellow'; // red on minimize button
    closebutton.style.color = 'black'; // white text on close button
    minimizebutton.style.color = 'black'; // white text on minimize button
  } else if (e.target === content) {
    frame.style.backgroundColor = 'rgba(0, 0, 0, 0.01)'; // red when over content
    closebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)'; // red on close button
    minimizebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)'; // red on minimize button
    closebutton.style.color = 'rgba(0,0,0,0.01)'; // white text on close button
    minimizebutton.style.color = 'rgba(0,0,0,0.01)'; // white text on minimize button
  }
});

frame.addEventListener('mouseout', (e) => {
  if (!frame.contains(e.relatedTarget)) {
    frame.style.backgroundColor = 'rgba(0, 0, 0, 0.01)'; // red when leaving entirely
    closebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)'; // red on close button
    minimizebutton.style.backgroundColor = 'rgba(0, 0, 0, 0.01)'; // red on minimize button
    closebutton.style.color = 'rgba(0,0,0,0.01)'; // white text on close button
    minimizebutton.style.color = 'rgba(0,0,0,0.01)'; // white text on minimize button
  }
});

frame.addEventListener('click', (e) => {
  if (e.target === closebutton) {
    window.close();
  } else if (e.target === minimizebutton) {
    ipcRenderer.send('minimize-window');
  }
});
