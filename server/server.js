import { setServers } from 'dns';
import express from 'express';
import { createServer } from 'http';
import { Server} from 'socket.io'

const app = express();


const server = createServer(app);

const io  = new Server(server , {
    cors :{
        origin : "*",
        credentials : true
    }
})


io.on('connection' , (socket)=>{
    console.log("new user connected with id :" , socket.id )

    socket.emit('welcome' , "Welcome to the server")
    
    socket.on('message' , (data)=>{
        console.log( data)
        io.to(data.room).emit("receive-message" , data.message)
    })

    socket.on('join-room' , (room)=> {
        
        socket.join(room)
        console.log("joined room : " , room)
    })

    socket.on('disconnect' , ()=> {
        console.log("socket disconnected : " , socket.id)
    })
})




server.listen(3000 , ()=> {
    console.log("Server is listening on port 3000")
})