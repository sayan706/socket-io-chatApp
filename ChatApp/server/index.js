import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import  cors  from 'cors';

const app = express();

const port = 8080;

// create new server
const server = createServer(app);
const io = new Server(server,{
    // that we use manual cors if we want to use cors package then use as middleware
    cors: {
        origin : "*",
        methods : ["GET","POST"],
        credentials : true,
    },
});

io.on("connection",(socket)=>{
    console.log("user is connected",socket.id);
    // socket.broadcast.emit("join",`${socket.id} user has joined`);
    // socket.emit("welcome",`Welcome to the Server ${socket.id}`);
    
    
    // Here we are using broadcast for multiple user 
    // socket.broadcast.emit("recieve-message",data);   
    socket.on("message",({room,message})=>{
        console.log({room,message});
        // But we want to use single user so we use room so we use io.to().emit
        io.to(room).emit("recieve-message", message);                               
    })
    socket.on("disconnect",()=>{
        console.log("User Disconnected!!!",socket.id);
    })
})

app.use(cors({
    origin : "*",
    methods : ["GET","POST"],
    credentials : true,
},
));

app.get("/",(req,res)=>{
    res.send("Hello World!!!");
})

server.listen(port,()=>{
    console.log(`server is running in port number ${port}`);
})

