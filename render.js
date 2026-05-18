const { ipcRenderer } = require('electron');

const frame = document.querySelector('.frame');
const content = document.querySelector('.content');
const closebutton = document.querySelector('.close-btn');
const minimizebutton = document.querySelector('.minimize-btn');
const checklistbutton = document.querySelector('.checklist-btn');
const timerbutton = document.querySelector('.timer-btn');
const timerContent = document.querySelector('.timer-content');
const timerDisplay = document.querySelector('.timer-display');
const incrementBtn = document.querySelector('.increment-btn');
const decrementBtn = document.querySelector('.decrement-btn');
const startBtn = document.querySelector('.start-btn');
const settingsBtn = document.querySelector('.settings-btn');
const settings = document.querySelector('.settings');
const blur = document.querySelector('.blur');
const closesettings = document.querySelector('.settings-close');
let minutes = 0;
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

document.addEventListener('click', (e) => {
  if (e.target === timerbutton) {
    timerContent.style.display = timerContent.style.display === 'flex' ? 'none' : 'flex';
    minutes = 0;
    timerDisplay.textContent = formatTime(minutes);
  }
});


frame.addEventListener('click', (e) => {
  if (e.target === timerbutton) {
    ipcRenderer.send('focus-main-window');
  }
});

let holdInterval = null;

incrementBtn.addEventListener('mousedown', () => {
  if (minutes < 90) {
    minutes += 1;
    timerDisplay.textContent = formatTime(minutes);
  }
  holdInterval = setInterval(() => {
    if (minutes < 90) {
      minutes += 1;
      timerDisplay.textContent = formatTime(minutes);
    }
  }, 100); 
});

incrementBtn.addEventListener('mouseup', () => {
  clearInterval(holdInterval);
});

decrementBtn.addEventListener('mousedown', () => {
  if (minutes > 0) {
    minutes -= 1;
    timerDisplay.textContent = formatTime(minutes);
  }
  holdInterval = setInterval(() => {
    if (minutes > 0) {
      minutes -= 1;
      timerDisplay.textContent = formatTime(minutes);
    }
  }, 100);
});

decrementBtn.addEventListener('mouseup', () => {
  clearInterval(holdInterval);
});

function formatTime(minutes) {
  const mins = minutes.toString().padStart(2, '0');
  return `${mins}:00`;
}

function formatTimewithSeconds(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function startTimer() {
  let remainingTime = minutes * 60; 
  timerDisplay.textContent = formatTimewithSeconds(remainingTime);
  const timerInterval = setInterval(() => {
    remainingTime -= 1;
    timerDisplay.textContent = formatTimewithSeconds(remainingTime);
    if (remainingTime <= 0) {
      ipcRenderer.send('request-unblock');
      clearInterval(timerInterval);
      timerDisplay.textContent = '00:00';
      incrementBtn.style.display = 'flex';
      decrementBtn.style.display = 'flex';
      startBtn.style.display = 'flex';
    }
  }, 1000);
}

startBtn.addEventListener('click', () => {
  ipcRenderer.send('request-block');
  if (minutes > 0) {
    startTimer();
    incrementBtn.style.display = 'none';
    decrementBtn.style.display = 'none';
    startBtn.style.display = 'none';
  }
});

settingsBtn.addEventListener('click', () => {
  blur.style.display = 'block';
  settings.style.display = 'block';
});

closesettings.addEventListener('click', ()=> {
  blur.style.display = 'none';
  settings.style.display = 'none';
})