const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://study-buddy-a9ke.onrender.com'],
    methods: ['GET', 'POST']
  }
});

const rooms = {};

// ── rate limiting ─────────────────────────────────────────

const rateLimits = new Map();

function isRateLimited(socketId, action, maxPerSecond = 5) {
  const key = `${socketId}:${action}`;
  const now = Date.now();
  const last = rateLimits.get(key) || [];
  const recent = last.filter(t => now - t < 1000);
  if (recent.length >= maxPerSecond) return true;
  recent.push(now);
  rateLimits.set(key, recent);
  return false;
}

// ── input sanitization ────────────────────────────────────

function sanitize(str, maxLength = 50) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

// ── room code generation ──────────────────────────────────

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── helper: assign slot ───────────────────────────────────

function assignSlot(room) {
  const used = room.members.map(m => m.slot);
  for (let i = 0; i < 7; i++) {
    if (!used.includes(i)) return i;
  }
  return -1;
}

// ── socket handlers ───────────────────────────────────────

app.get('/', (req, res) => {
  res.send('study buddy server is running!');
});

io.on('connection', (socket) => {
  console.log('user connected:', socket.id);

  // when user creates room we generate a code as a key to look up room object data
  // we add member array and message array to room, add user to this room
  socket.on('create-room', ({ name, cat }) => {
    name = sanitize(name);
    cat = sanitize(cat);
    if (!name) return;

    const code = generateCode();
    const slot = 0;
    rooms[code] = {
      members: [{ id: socket.id, name, cat, slot, studyTime: 0, focusStart: null }],
      messages: []
    };
    socket.join(code);
    socket.emit('room-created', { code });
  });

  // when user clicks join room, if code is correct user enters room
  socket.on('join-room', ({ code, name, cat }) => {
    name = sanitize(name);
    cat = sanitize(cat);
    code = sanitize(code, 10);
    if (!name || !code) return;

    const room = rooms[code.toUpperCase()];
    if (!room) {
      socket.emit('error', { message: 'Room not found!' });
      return;
    }
    if (room.members.length >= 7) {
      socket.emit('error', { message: 'Room is full!' });
      return;
    }

    const slot = assignSlot(room);
    room.members.push({ id: socket.id, name, cat, slot, studyTime: 0, focusStart: null });
    socket.join(code.toUpperCase());
    socket.emit('room-joined', {
      code,
      members: room.members,
      messages: room.messages
    });
    socket.to(code.toUpperCase()).emit('member-joined', { name, cat, slot });
  });

  // when user sends message, label the message with the user name and time,
  // and broadcast to the room
  socket.on('send-message', ({ code, name, text }) => {
    code = sanitize(code, 10);
    name = sanitize(name);
    text = sanitize(text, 500);
    if (!code || !name || !text) return;
    if (isRateLimited(socket.id, 'message', 3)) return;

    const message = { name, text, timestamp: Date.now() };
    if (rooms[code]) {
      rooms[code].messages.push(message);
      io.to(code).emit('new-message', message);
    }
  });

  // finds room through code, removes user by matching their socket id,
  // notifies others, if no one left delete the room
  socket.on('leave-room', ({ code, name }) => {
    code = sanitize(code, 10);
    name = sanitize(name);
    if (!code || !name) return;

    const room = rooms[code];
    if (!room) return;
    const member = room.members.find(m => m.id === socket.id);
    room.members = room.members.filter(m => m.id !== socket.id);
    socket.leave(code);
    if (member) socket.to(code).emit('member-left', { name: member.name, slot: member.slot });
    if (room.members.length === 0) delete rooms[code];
  });

  // when user disconnects unexpectedly, loop through all rooms to find
  // which room they were in, remove them, notify others, delete room if empty
  socket.on('disconnect', () => {
    Object.keys(rooms).forEach(code => {
      const room = rooms[code];
      const member = room.members.find(m => m.id === socket.id);
      if (member) {
        room.members = room.members.filter(m => m.id !== socket.id);
        socket.to(code).emit('member-left', { name: member.name, slot: member.slot });
        if (room.members.length === 0) delete rooms[code];
      }
    });
    // clean up rate limit data for this socket
    for (const key of rateLimits.keys()) {
      if (key.startsWith(socket.id)) rateLimits.delete(key);
    }
  });

  socket.on('focus-start', ({ code }) => {
    code = sanitize(code, 10);
    if (!code) return;

    const room = rooms[code];
    if (!room) return;
    const member = room.members.find(m => m.id === socket.id);
    if (member) member.focusStart = Date.now();
  });

  socket.on('focus-stop', ({ code }) => {
    code = sanitize(code, 10);
    if (!code) return;

    const room = rooms[code];
    if (!room) return;
    const member = room.members.find(m => m.id === socket.id);
    if (member && member.focusStart) {
      member.studyTime += Date.now() - member.focusStart;
      member.focusStart = null;
      // broadcast updated leaderboard
      const leaderboard = room.members
        .map(m => ({ name: m.name, studyTime: m.studyTime }))
        .sort((a, b) => b.studyTime - a.studyTime);
      io.to(code).emit('leaderboard-update', leaderboard);
    }
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});