
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
 
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
 
const rooms = {};
 
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
 
function assignSlot(room) {
  const used = room.members.map(m => m.slot);
  for (let i = 0; i < 7; i++) {
    if (!used.includes(i)) return i;
  }
  return -1;
}
 
function broadcastLeaderboard(code) {
  const room = rooms[code];
  if (!room) return;
  const leaderboard = room.members
    .map(m => ({
      name: m.name,
      studyTime: m.studyTime + (m.focusStart ? Date.now() - m.focusStart : 0)
    }))
    .sort((a, b) => b.studyTime - a.studyTime);
  io.to(code).emit('leaderboard-update', leaderboard);
}
 
// update leaderboard every 5 seconds for active rooms
setInterval(() => {
  Object.keys(rooms).forEach(code => {
    const room = rooms[code];
    const anyFocusing = room.members.some(m => m.focusStart !== null);
    if (anyFocusing) broadcastLeaderboard(code);
  });
}, 5000);
 
io.on('connection', (socket) => {
  console.log('user connected:', socket.id);
 
  socket.on('create-room', ({ name, cat }) => {
    const code = generateCode();
    rooms[code] = {
      members: [{ id: socket.id, name, cat, slot: 0, studyTime: 0, focusStart: null }],
      messages: []
    };
    socket.join(code);
    socket.emit('room-created', { code });
  });
 
  socket.on('join-room', ({ code, name, cat }) => {
    const room = rooms[code.toUpperCase()];
    if (!room) { socket.emit('error', { message: 'Room not found!' }); return; }
    if (room.members.length >= 7) { socket.emit('error', { message: 'Room is full!' }); return; }
    const slot = assignSlot(room);
    room.members.push({ id: socket.id, name, cat, slot, studyTime: 0, focusStart: null });
    socket.join(code.toUpperCase());
    socket.emit('room-joined', { code, members: room.members, messages: room.messages });
    socket.to(code.toUpperCase()).emit('member-joined', { name, cat, slot });
  });
 
  socket.on('send-message', ({ code, name, text }) => {
    const message = { name, text, timestamp: Date.now() };
    if (rooms[code]) {
      rooms[code].messages.push(message);
      io.to(code).emit('new-message', message);
    }
  });
 
  socket.on('leave-room', ({ code, name }) => {
    const room = rooms[code];
    if (!room) return;
    const member = room.members.find(m => m.id === socket.id);
    const slot = member?.slot;
    room.members = room.members.filter(m => m.id !== socket.id);
    socket.leave(code);
    socket.to(code).emit('member-left', { name, slot });
    if (room.members.length === 0) delete rooms[code];
  });
 
  socket.on('disconnect', () => {
    Object.keys(rooms).forEach(code => {
      const room = rooms[code];
      const member = room.members.find(m => m.id === socket.id);
      if (member) {
        const slot = member.slot;
        room.members = room.members.filter(m => m.id !== socket.id);
        socket.to(code).emit('member-left', { name: member.name, slot });
        if (room.members.length === 0) delete rooms[code];
      }
    });
  });
 
  socket.on('focus-start', ({ code }) => {
    const room = rooms[code];
    if (!room) return;
    const member = room.members.find(m => m.id === socket.id);
    if (member) member.focusStart = Date.now();
  });
 
  socket.on('focus-stop', ({ code }) => {
    const room = rooms[code];
    if (!room) return;
    const member = room.members.find(m => m.id === socket.id);
    if (member && member.focusStart) {
      member.studyTime += Date.now() - member.focusStart;
      member.focusStart = null;
      broadcastLeaderboard(code);
    }
  });
});
 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
 