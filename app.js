const express = require('express');
const bodyParse = require('body-parser');
const userList = require('./userList.js')
const app = express();

const fs = require('fs');

app.use(bodyParse.json());
app.use(express.static('public'));
app.use(bodyParse.urlencoded({extended: true}));


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/user_list");
var db = mongoose.connection;
db.on('error', (err)=>{console.log(err)});
db.on("open",()=>{
    console.log("Connection succeed...")
});

app.get('/',(req, res)=>{
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.sendFile(__dirname + '/signIn.html');
});

app.post('/signUp', async(req,res)=>{
    console.log(req.body);

    const newUser = new userList({
        username: req.body.username,
        password: req.body.password
    });

    try{
        const save = await newUser.save();
        res.send(save);
    }catch(err){
        res.send(err)
    }
});


app.post('/signIn', async(req, res)=>{
    const match = await userList.find({username: req.body.username});
    if(match.length == 0){
        res.send("Invalid user")
    }else{
        if(match[0].password == req.body.password){
            res.send("Successfully Login ...!!!")
        }else{
            res.send("Invalid Password :(")
        }
    }
});


app.get("/stream", (req, res)=>{
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.sendFile(__dirname + "/videoStream.html");
});

app.get("/video",(req,res)=>{
    const path = "video.mp4" ;
    const fileSize = fs.statSync(path).size;
    const range = req.headers.range;
    console.log(range, fileSize);
    if(range){
        const parts = range.replace(/bytes=/,"").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = (end-start)+1;
        const file = fs.createReadStream(path,{start,end}); 
        const head = {
            'Content-Range' :`bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges' : 'bytes',
            'Content-Length' : chunkSize,
            'Content-Type':'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res);

    }else{
        const head={
            'Content-Length' : fileSize,
            'Content-Type' : 'video/mp4'
        }
        res.writeHead(200, head),
        fs.createReadStream(path).pipe(res);
    }
})



// mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false


app.listen(3000,()=>{console.log("app listening on the port 3000")});


// In order to run for video call , use the command ` node server.js` .

// To run Chat app, use the command `node chatApp.js`

// To run Collaborative Drawing app, use the command `node drawingApp.js`