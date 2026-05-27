const { ipcRenderer } = require('electron');
const io = require('socket.io-client');

const socket = io('http://localhost:3000'); // change to Railway URL later

const roomCode = document.querySelector('.room-code');
const membersList = document.querySelector('.members-list');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input');
const leaveBtn = document.querySelector('.leave-btn');
const chatBtn = document.querySelector('.chat-btn');
const chat = document.querySelector('.chat');

// get name and code passed from invite window
const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const isCreator = params.get('creator') === 'true';
const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];


let currentCode = params.get('code') || '';
let charCount = 0;

roomCode.textContent = 'TEST';

console.log('name:', name);
console.log('isCreator:', isCreator);
console.log('currentCode:', currentCode);

// connect to room
socket.on('connect', () => {
  console.log('socket connected!');
  if (isCreator) {
    socket.emit('create-room', { name });
  } else {
    socket.emit('join-room', { code: currentCode, name });
  }
});

socket.on('room-created', ({ code: roomCodeValue }) => {
  console.log('room created:', roomCodeValue);
  currentCode = roomCodeValue;
  roomCode.textContent = `Room: ${roomCodeValue}`;
});

socket.on('room-joined', ({ code: roomCodeValue, members, messages }) => {
  currentCode = roomCodeValue;
  roomCode.textContent = `Room: ${roomCodeValue}`;
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

chatBtn.addEventListener('click', ()=>{
  chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
})

chatInput.addEventListener('input', () => {
  if (chatInput.value.length > 500) {
    chatInput.value = chatInput.value.substring(0, 200);
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

// leave room
leaveBtn.addEventListener('click', () => {
  socket.emit('leave-room', { code: currentCode, name });
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
  chatMessages.scrollTop = chatMessages.scrollHeight;
}