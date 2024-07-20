const express = require('express');
const app = express();
const http = require('http');

const socketio = require('socket.io');
const server = http.createServer(app);

const io = socketio(server);
const os = require('os');

app.set('view engine', 'ejs');
app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('location', (data) => {
    io.emit('recive-location', { id: socket.id, hostname: os.hostname(), ...data });
  });
  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
  });
});


app.get('/', (req, res) => {
  res.render('index');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});