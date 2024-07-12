const express= require("express")
const app=express()
const path=require("path")
const http=require("http")
const  Socket  = require("socket.io")
const server=http.createServer(app)
const io= Socket(server)
app.get("/",(req,res)=>{
    res.render("index" )
})
io.on("connection",(socket)=>{
    console.log("connected",socket.id)
    socket.on('sendlocation',(data)=>{
        console.log(socket.id)

      io.emit("getuserlocation",{id:socket.id,...data})
    })
    socket.on("disconnect",()=>{
        io.emit("userdisconnected",socket.id)
    })
})
const PORT=3000
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine","ejs")
server.listen(PORT,()=>{
    console.log("listening at 3000")
})