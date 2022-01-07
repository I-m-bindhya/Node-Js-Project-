var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');

app.use(express.static(path.join(__dirname,'./public')));

app.get('/Chat', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

var name;

io.on('connection', (socket) => {
  console.log('new user connected');
  
  socket.on('joining msg', (username) => {
  	name = username;
  	io.emit('chat message', `---${name} joined the chat---`);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', `---${name} left the chat---`);
    
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
  });

  socket.on('base64 file', function (msg) {
    console.log('received base64 file from' + msg.username);
    socket.username = msg.username;
    // socket.broadcast.emit('base64 image', //exclude sender
    socket.broadcast.emit('base64 file',  //include sender

        {
          username: socket.username,
          file: msg.file,
          fileName: msg.fileName
        }

    );
});
});

server.listen(3000, () => {
    console.log('Server listening on :3000');
});