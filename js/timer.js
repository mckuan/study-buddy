const timerContent = document.querySelector('.timer-content');

const timerDisplay = document.querySelector('.timer-display');

const incrementBtn = document.querySelector('.increment-btn');
const decrementBtn = document.querySelector('.decrement-btn');

const startBtn = document.querySelector('.start-btn');

const pauseBtn = document.querySelector('.pause-btn');
const stopBtn = document.querySelector('.stop-btn');

const timerbutton = document.querySelector('.timer-btn');

const settingsblur = document.querySelector('.blur-settings');

let minutes = 0;

let isPaused = false;

let timerInterval = null;

let remainingTime = 0;

let holdInterval = null;

let isResuming = false;

// ---------------- OPEN TIMER ----------------

timerbutton.addEventListener('click', () => {
  timerContent.style.display = timerContent.style.display === 'flex' ? 'none' : 'flex';
  minutes = 0;
  timerDisplay.textContent = formatTime(minutes);
});

// ---------------- FORMAT ----------------

function formatTime(mins) {
  return `${mins.toString().padStart(2, '0')}:00`;
}

function formatTimeWithSeconds(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');

  const secs = (seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${mins}:${secs}`;
}

// ---------------- TIMER ----------------

function startTimer(startFrom = minutes * 60) {
  clearInterval(timerInterval);

  settingsblur.style.display = 'block';

  remainingTime = startFrom;

  timerDisplay.textContent =
    formatTimeWithSeconds(remainingTime);

  timerInterval = setInterval(() => {
    remainingTime--;

    timerDisplay.textContent =
      formatTimeWithSeconds(remainingTime);

    if (remainingTime <= 0) {
      stopTimer();
    }
  }, 1000);
}

function pauseTimer() {
  if (isPaused) {
    isResuming = true;

    ipcRenderer.send('timer-request-block');

    isPaused = false;

    pauseBtn.textContent = '⏸';
  } else {
    ipcRenderer.send('timer-request-unblock');

    clearInterval(timerInterval);

    isPaused = true;

    pauseBtn.textContent = '▶';
  }
}

function stopTimer() {
  clearInterval(timerInterval);

  remainingTime = 0;

  isPaused = false;

  ipcRenderer.send('timer-request-unblock');

  settingsblur.style.display = 'none';

  timerDisplay.textContent = '00:00';

  incrementBtn.style.display = 'flex';
  decrementBtn.style.display = 'flex';

  pauseBtn.style.display = 'none';
  stopBtn.style.display = 'none';

  startBtn.style.display = 'flex';
}

// ---------------- START ----------------

startBtn.addEventListener('click', () => {
  console.log('start clicked, minutes:', minutes);
  if (minutes <= 0) return;
  ipcRenderer.send('timer-request-block');
});

// TIMER ONLY

ipcRenderer.on('timer-block-success', () => {
  if (isResuming) {
    isResuming = false;

    startTimer(remainingTime);
  } else {
    incrementBtn.style.display = 'none';
    decrementBtn.style.display = 'none';

    pauseBtn.style.display = 'flex';
    stopBtn.style.display = 'flex';

    startBtn.style.display = 'none';

    startTimer();
  }
});

ipcRenderer.on('timer-block-failed', (_, { wrongPassword }) => {
  if (wrongPassword) {
    incrementBtn.style.display = 'flex';
    decrementBtn.style.display = 'flex';

    startBtn.style.display = 'flex';

    timerDisplay.textContent =
      formatTime(minutes);
  }
});

// ---------------- BUTTONS ----------------

incrementBtn.addEventListener('mousedown', () => {
  if (minutes < 90) {
    minutes++;
    timerDisplay.textContent = formatTime(minutes);
  }

  holdInterval = setInterval(() => {
    if (minutes < 90) {
      minutes++;
      timerDisplay.textContent =
        formatTime(minutes);
    }
  }, 100);
});

incrementBtn.addEventListener('mouseup', () => {
  clearInterval(holdInterval);
});

incrementBtn.addEventListener('mouseleave', () => {
  clearInterval(holdInterval);
});

decrementBtn.addEventListener('mousedown', () => {
  if (minutes > 0) {
    minutes--;
    timerDisplay.textContent = formatTime(minutes);
  }

  holdInterval = setInterval(() => {
    if (minutes > 0) {
      minutes--;
      timerDisplay.textContent =
        formatTime(minutes);
    }
  }, 100);
});

decrementBtn.addEventListener('mouseup', () => {
  clearInterval(holdInterval);
});

decrementBtn.addEventListener('mouseleave', () => {
  clearInterval(holdInterval);
});

pauseBtn.addEventListener('click', pauseTimer);

stopBtn.addEventListener('click', stopTimer);