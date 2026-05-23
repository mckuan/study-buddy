const { ipcRenderer } = require('electron');
const io = require('socket.io-client');

const socket = io('http://localhost:3000'); // ✅ change to Railway URL later

const roomCode = document.querySelector('.room-code');
const membersList = document.querySelector('.members-list');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input');
const sendBtn = document.querySelector('.send-btn');
const leaveBtn = document.querySelector('.leave-btn');

// ✅ get name and code passed from invite window
const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const code = params.get('code');
const isCreator = params.get('creator') === 'true';

// ✅ connect to room
socket.on('connect', () => {
  if (isCreator) {
    socket.emit('create-room', { name });
  } else {
    socket.emit('join-room', { code, name });
  }
});

socket.on('room-created', ({ code }) => {
  roomCode.textContent = `Room: ${code}`;
});

socket.on('room-joined', ({ code, members, messages }) => {
  roomCode.textContent = `Room: ${code}`;
  members.forEach(m => addMember(m.name));
  messages.forEach(m => addMessage(m.name, m.text));
});

socket.on('member-joined', ({ name }) => {
  addMember(name);
  addMessage('', `${name} joined`);
});

socket.on('member-left', ({ name }) => {
  removeMember(name);
  addMessage('', `${name} left`);
});

socket.on('new-message', ({ name, text }) => {
  addMessage(name, text);
});

socket.on('error', ({ message }) => {
  addMessage('', `❌ ${message}`);
});

// ✅ send message
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  if (!chatInput.value.trim()) return;
  socket.emit('send-message', { 
    code: roomCode.textContent.replace('Room: ', ''), 
    name, 
    text: chatInput.value.trim() 
  });
  chatInput.value = '';
}

// ✅ leave room
leaveBtn.addEventListener('click', () => {
  socket.emit('leave-room', { 
    code: roomCode.textContent.replace('Room: ', ''), 
    name 
  });
  ipcRenderer.send('leave-room');
});

function addMember(name) {
  const div = document.createElement('div');
  div.classList.add('member');
  div.textContent = `👤 ${name}`;
  div.dataset.name = name;
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
  chatMessages.scrollTop = chatMessages.scrollHeight; // ✅ auto scroll
}