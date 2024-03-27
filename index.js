const express = require('express')
const {v4:uuidV4}=require('uuid')
const app = express()
const port = 3000

const server=require('http').Server(app)
const io=require('socket.io')(server)
app.set('view engine','ejs')
app.use(express.static('public'))
app.get('/',(req,res)=>{
res.redirect(`/${uuidV4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on("connection",socket=>{
    socket.on('join-room',(roomId,userId)=>{
socket.join(roomId)
socket.broadcast.to(roomId).emit('user-joined', userId);
console.log(`${userId} joined room ${roomId}`);
        console.log(roomId,userId)
    })
})
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})