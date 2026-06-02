const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const rooms = {};

function assignSlot(room) {
  const used = room.members.map(m => m.slot);
  for (let i = 0; i < 7; i++) {
    if (!used.includes(i)) return i;
  }
  return -1;
}


function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('user connected:', socket.id);

  //when user creates room we generate a code as a key to look up room object data
  // we add member array and message array to room add user to this room
  socket.on('create-room', ({ name, cat }) => {
    const code = generateCode();
    rooms[code] = {
      members: [{ id: socket.id, name, cat, studyTime: 0, focusStart: null }],
      messages: []
    };
    socket.join(code);
    socket.emit('room-created', { code });
  });

  //when user clicks join room, if code is correct user enters room
  socket.on('join-room', ({ code, name, cat }) => {
  const room = rooms[code.toUpperCase()];
  console.log('members when B joins:', JSON.stringify(room.members));
    if (!room) { socket.emit('error', { message: 'Room not found!' }); return; }
    if (room.members.length >= 7) { socket.emit('error', { message: 'Room is full!' }); return; }
    room.members.push({ id: socket.id, name, cat });
    socket.join(code.toUpperCase());
    socket.emit('room-joined', { code, members: room.members, messages: room.messages });
    socket.to(code.toUpperCase()).emit('member-joined', { name, cat });  // <-- include cat
  });

  //when user sends message, label the message with the user name and time, and 
  //broadcast to the room
  socket.on('send-message', ({ code, name, text }) => {
    const message = { name, text, timestamp: Date.now() };
    if (rooms[code]) {
      rooms[code].messages.push(message);
      io.to(code).emit('new-message', message);
    }
  });

  // finds room through code, removes user by matching their socket id,
  // notifies others, if no one left delete the room
  socket.on('leave-room', ({ code, name }) => {
    const room = rooms[code];
    if (!room) return;
    room.members = room.members.filter(m => m.id !== socket.id);
    socket.leave(code);
    socket.to(code).emit('member-left', { name });
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
        socket.to(code).emit('member-left', { name: member.name });
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