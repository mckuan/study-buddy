const { ipcRenderer } = require('electron');
const io = require('socket.io-client');

const socket = io('https://study-buddy-a9ke.onrender.com');

const roomCode = document.querySelector('.room-code');
const membersList = document.querySelector('.members-list');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input');
const leaveBtn = document.querySelector('.leave-btn');
const chatBtn = document.querySelector('.chat-btn');
const chat = document.querySelector('.chat');
const leaderboardBtn = document.querySelector('.leaderboard');
const leaderboard = document.querySelector('.leaderboard-content');
const ranking = document.querySelector('.ranking');
const focus = document.querySelector('.focus-mode');

(async () => {
  const params = new URLSearchParams(window.location.search);
  const name = await ipcRenderer.invoke('get-player-name') || params.get('name') || 'Anonymous';
  const isCreator = params.get('creator') === 'true';
  const cat = await ipcRenderer.invoke('get-cat-color');

  let currentCode = params.get('code') || '';
  let focusClicked = false;
  let studyInterval = null;
  let studyTime = 0;
  const slots = new Array(7).fill(null);


  // ── socket connection ─────────────────────────────────────

  socket.on('connect', () => {
    console.log('socket connected!');
    if (isCreator) {
      socket.emit('create-room', { name, cat });
    } else {
      socket.emit('join-room', { code: currentCode, name, cat });
    }
  });

  socket.on('room-joined', ({ code: roomCodeValue, members, messages }) => {
    currentCode = roomCodeValue;
    roomCode.textContent = `Room: ${roomCodeValue}`;
    members.forEach(m => {
      slots[m.slot] = m.name;
      addMember(m.name, m.cat, m.slot);
    });
    messages.forEach(m => addMessage(m.name, m.text));
  });

  socket.on('room-created', ({ code: roomCodeValue }) => {
    currentCode = roomCodeValue;
    roomCode.textContent = `Room: ${roomCodeValue}`;
    slots[0] = name;
    addMember(name, cat, 0);
  });

  socket.on('member-joined', ({ name, cat, slot }) => {
    slots[slot] = name;
    addMember(name, cat, slot);
    addMessage('', `${name} joined`);
  });

  socket.on('member-left', ({ name, slot }) => {
    slots[slot] = null;
    removeMember(name);
    addMessage('', `${name} left`);
  });

  socket.on('new-message', ({ name, text }) => {
    addMessage(name, text);
  });

  socket.on('error', ({ message }) => {
    addMessage('', `❌ ${message}`);
  });

  socket.on('leaderboard-update', (entries) => {
    renderLeaderBoard(entries.map(e => ({
      name: e.name,
      studyTime: Math.floor(e.studyTime / 60)
    })));
  });

  // ── chat ──────────────────────────────────────────────────

  chatBtn.addEventListener('click', () => {
    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
    leaderboard.style.display = 'none';
  });

  leaderboardBtn.addEventListener('click', () => {
    leaderboard.style.display = leaderboard.style.display === 'flex' ? 'none' : 'flex';
    chat.style.display = 'none';
  });

  chatInput.addEventListener('input', () => {
    if (chatInput.value.length > 500) {
      chatInput.value = chatInput.value.substring(0, 500);
    }
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    if (!chatInput.value.trim()) return;
    socket.emit('send-message', {
      code: currentCode,
      name,
      text: chatInput.value.trim()
    });
    chatInput.value = '';
  }

  // ── leave room ────────────────────────────────────────────

  leaveBtn.addEventListener('click', () => {
    socket.emit('leave-room', { code: currentCode, name });
    ipcRenderer.send('timer-request-unblock');
    ipcRenderer.send('leave-room');
  });

  // ── focus mode ────────────────────────────────────────────

  focus.addEventListener('click', () => {
    if (focusClicked) {
      focus.style.backgroundColor = '#eda3a3';
      focusClicked = false;
      clearInterval(studyInterval);
      studyInterval = null;
      ipcRenderer.send('timer-request-unblock');
    } else {
      focus.style.backgroundColor = '#7379e2';
      focusClicked = true;
      ipcRenderer.send('timer-request-block');
      studyInterval = setInterval(() => {
        studyTime++;
        const mins = Math.floor(studyTime / 60);
        const secs = studyTime % 60;
        renderLeaderBoard([{ name, display: `${mins}m ${secs}s` }]);
      }, 1000);
    }
  });

  // ── helpers ───────────────────────────────────────────────

  const POSITIONS = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6', 'pos7'];

  function addMember(name, cat, index) {
    const slot = POSITIONS[index % POSITIONS.length];
    const div = document.createElement('div');
    div.classList.add('member-cat', slot);
    div.dataset.name = name;

    const img = document.createElement('img');
    const imgPath = `assets/room/${slot}/${cat}.png`;
    console.log('cat image path:', imgPath, '| cat:', cat);
    img.src = imgPath;
    img.onerror = () => console.log('IMAGE FAILED TO LOAD:', img.src);
    img.alt = name;

    const label = document.createElement('span');
    label.textContent = name;

    div.appendChild(img);
    div.appendChild(label);
    membersList.appendChild(div);
  }

  function removeMember(name) {
    const member = membersList.querySelector(`[data-name="${name}"]`);
    if (member) member.remove();
  }

  function addMessage(name, text) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.textContent = name ? `${name}: ${text}` : text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderLeaderBoard(entries) {
    ranking.innerHTML = '';
    entries.forEach((entry, i) => {
      const div = document.createElement('div');
      div.classList.add('leaderboard-entry');
      div.textContent = `${i + 1}. ${entry.name} — ${entry.display ?? entry.studyTime + 'min'}`;
      ranking.appendChild(div);
    });
  }

  // ── init ──────────────────────────────────────────────────
  renderLeaderBoard([{ name, display: '0m 0s' }]);
})();