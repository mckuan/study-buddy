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

io.on('connection', (socket) => {
  console.log('user connected:', socket.id);

  //when user creates room we generate a code as a key to look up room object data
  // we add member array and message array to room add user to this room
  socket.on('create-room', ({ name }) => {
    const code = generateCode();
    rooms[code] = {
      members: [{ id: socket.id, name }],
      messages: []
    };
    socket.join(code);
    socket.emit('room-created', { code });
  });

  //when user clicks join room, if code is correct user enters room
  socket.on('join-room', ({ code, name }) => {
    const room = rooms[code.toUpperCase()];
    if (!room) {
      socket.emit('error', { message: 'Room not found!' });
      return;
    }
    room.members.push({ id: socket.id, name });
    socket.join(code.toUpperCase());
    socket.emit('room-joined', {
      code,
      members: room.members,
      messages: room.messages
    });
    socket.to(code.toUpperCase()).emit('member-joined', { name });
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
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});