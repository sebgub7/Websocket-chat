const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

const users = [];
const messages = [];

app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

io.on('connection', (socket) => {
  socket.on('join', name => {
    console.log(`${name} Joined`);
    users.push({ name, id: socket.id });
    socket.broadcast.emit('message', { author: 'Chat Bot', content: `${name} join to chat :)` });
  })
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
    const i = users.findIndex(user => user.id === socket.id);
    if (i >= 0) {
      socket.broadcast.emit('message', { author: 'Chat Bot', content: `${users[i].name} left :(` });
      users.splice(i, 1);
    }
  });
});