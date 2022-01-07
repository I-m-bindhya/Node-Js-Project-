const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express()

app.post("/generateJwt", (req,res)=>{
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = "bindhya";

    let token = jwt.sign(data, jwtSecretKey);
    res.send(token);
});

app.get('/validate',(req,res)=>{
        
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {
        const token = req.headers.authorization;
  
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            return res.send("Successfully Verified");
        }else{
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
}).listen('3000',()=>{})