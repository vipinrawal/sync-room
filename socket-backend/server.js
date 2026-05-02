const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors')

const app = express();
app.use(cors())
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const rooms = {};
const colors =  ['sky', 'pink', 'red']

function getRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      users: [],
      messages: [],
      currentTime: 0,
      isPlaying: true,
      videoId: null,
      queue: ['fUgUKlMOnds']
    }
  }
  return rooms[roomId]
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let username = null;

  socket.on('join-room', ({ roomId, name }) => {
    currentRoom = roomId;
    username = name;
    socket.join(roomId)
    console.log(username + ' join the room')

    const room = getRoom(roomId);
    const color = room.users.length
    room.users.push({id: socket.id, name, color: colors[color] });

    socket.emit('room-state', room);
    addMessage(currentRoom, null, `${username} join the room`, 'system')
  })

  socket.on('get-sync', (callback)=>{
    const room = getRoom(currentRoom)
    callback(room);
  })

  socket.on('pause', ({currentTime})=>{
    const room = getRoom(currentRoom)
    room.isPlaying = false;
    room.currentTime = Math.floor(currentTime)
    io.to(currentRoom).emit('sync', room)
  })

  socket.on('play', ({currentTime})=>{
    const room = getRoom(currentRoom)
    room.isPlaying = true;
    room.currentTime = Math.floor(currentTime)
    io.to(currentRoom).emit('sync', room)
  })

  socket.on('seek', ({currentTime})=>{
    const room = getRoom(currentRoom)
    room.currentTime = Math.floor(currentTime)
    io.to(currentRoom).emit('sync', room)
  })

  socket.on('load-video', ({videoId})=>{
    const room = getRoom(currentRoom);
    room.isPlaying = true;
    room.currentTime = 0;
    room.videoId = videoId
    io.to(currentRoom).emit('sync', room)
    addMessage(currentRoom, null, `${username} add a track`, 'system')
  })

  socket.on('chat', ({ message }) => {
    if (!currentRoom) return;
    addMessage(currentRoom, username, message, 'chat');
  });

  socket.on('add-to-queue', ({ videoId }) => {
    const room = getRoom(currentRoom);
    room.queue.push(videoId);
    io.to(currentRoom).emit('sync', room);
  });

  socket.on('play-next', () => {
    const room = getRoom(currentRoom);
    if (room.queue.length === 0) return;

    const next = room.queue.shift();
    room.videoId = next;
    room.isPlaying = true;
    room.currentTime = 0;
    io.to(currentRoom).emit('sync', room);
  });

  socket.on('disconnect', ()=>{
  const room = getRoom(currentRoom)
  if (!currentRoom || !rooms[currentRoom]) return;
  rooms[currentRoom].users = rooms[currentRoom].users.filter(u => u.id !== socket.id);
  addMessage(currentRoom, null, `${username} left the room`, 'system')
  io.to(currentRoom).emit('sync', room)
  })

  function addMessage(roomId, from, text, type) {
    const room = getRoom(roomId);
    const msg = { from, text, time: new Date().toLocaleTimeString(), type };
    room.messages.push(msg);
    io.to(roomId).emit('message', msg);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});