const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods:["GET","POST"]
    }
});
// real time message ke liye ek function 

const users={}

 const getRecieverSocketId=(recieverId)=>{
   return users[recieverId] 
}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    // Log the entire handshake query to debug if `userId` is coming correctly
    console.log("Handshake Query:", socket.handshake.query);

    const userId = socket.handshake.query.userId;
    
    if (!userId) {
        console.log(" Warning: userId is missing in handshake query!");
        return;
    }
    console.log(`User ID received: ${userId}`);
    users[userId]=socket.id  // iska matlab hai aise likhan 
    //  {
    //     "123": "abcd1234"
    //   }
      
    console.log("hello ",users)
    io.emit("getOnlineUsers",Object.keys(users))  //io.emit sabhi connected clients ko ek event bhejne ke liye use hota hai. Iska matlab hai ki agar multiple users connected hain, toh io.emit un sabhi ko ek sath message bhej sakta hai.


    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        delete users[userId],
        io.emit("getOnlineUsers",Object.keys(users))
    });
});

module.exports = { app, io, server,getRecieverSocketId };
