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
const toggle = document.querySelector('.toggle-input');
const dropdownBtn = document.querySelector('.dropdown-button');
const dropdown = document.querySelector('.dropdown');
const errorPopup = document.querySelector('.error-popup');
const settingsblur = document.querySelector('.blur-settings');
const blockedContainer = document.querySelector('.sites'); 

let minutes = 0;
let checklistOpen = false;
let holdInterval = null;
let blockedsites = JSON.parse(localStorage.getItem('blockedsites')) || 
['reddit.com', 'youtube.com', 'twitter.com', 'facebook.com', 'instagram.com'];

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
  settingsblur.style.display = 'block';
  let remainingTime = minutes * 60; 
  timerDisplay.textContent = formatTimewithSeconds(remainingTime);
  const timerInterval = setInterval(() => {
    remainingTime -= 1;
    timerDisplay.textContent = formatTimewithSeconds(remainingTime);
    if (remainingTime <= 0) {
      ipcRenderer.send('request-unblock');
      clearInterval(timerInterval);
      settingsblur.style.display = 'none';
      timerDisplay.textContent = '00:00';
      incrementBtn.style.display = 'flex';
      decrementBtn.style.display = 'flex';
      startBtn.style.display = 'flex';
    }
  }, 1000);
}

startBtn.addEventListener('click', () => {
  if (minutes > 0) {
    ipcRenderer.send('request-block');
    incrementBtn.style.display = 'none';
    decrementBtn.style.display = 'none';
    startBtn.style.display = 'none';
  }
});

settingsBtn.addEventListener('click', () => {
  blur.style.display = 'block';
  settings.style.display = 'block';
  ipcRenderer.send('get-blocking-enabled');
});

ipcRenderer.on('blocking-enabled-state', (_, { enabled }) => {
  toggle.checked = enabled;
});

closesettings.addEventListener('click', ()=> {
  blur.style.display = 'none';
  settings.style.display = 'none';
})

toggle.addEventListener('change', () => {
  ipcRenderer.send('set-blocking-enabled', {
    enabled: toggle.checked,
    sites: null  
  });
});

ipcRenderer.on('toggle-block-failed', (_, { wrongPassword }) => {
  toggle.checked = false;
  if (wrongPassword) {
    incrementBtn.style.display = 'flex';
    decrementBtn.style.display = 'flex';
    startBtn.style.display = 'flex';
    errorPopup.style.display = 'block';
    timerDisplay.textContent = formatTime(minutes);
    setTimeout(() => errorPopup.style.display = 'none', 3000);
  } else {
    startTimer();
  }
});

ipcRenderer.on('toggle-block-success', () => {
  toggle.checked = true;
  startTimer();
})

dropdownBtn.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
})

async function getblockedsites(){
  return await ipcRenderer.invoke('get-blocked-sites');
}

function renderDropdown(){
  blockedContainer.innerHTML = '';
  blockedsites.forEach(site => {
    const siteElement = document.createElement('div');
    siteElement.textContent = site;
    blockedContainer.appendChild(siteElement);
  });
}

renderDropdown();