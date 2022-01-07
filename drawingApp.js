const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');

app.use(express.static(path.join(__dirname,'./drawingApps')));

app.get('/canvas',(req,res)=>{
    return res.sendFile(__dirname + "/drawingApps/canvas.html");
});

io.on("connection" , (socket)=>{
    console.log("new user joined");
    socket.on("new user",(username)=>{
        io.emit("message",` ${username} Joined `)
    });
    socket.on("disconnect",(username)=>{
        io.emit("message",` ${username} Joined `)
    });
    socket.on("canvas",(ctx)=>{
        io.emit('canvas', ctx);  
    });
})

server.listen(3000, () => {
    console.log('Server listening on :3000');
})