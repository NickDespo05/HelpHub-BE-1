const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("mongoose-bcrypt");
const defineCurrentUser = require("./middleware/defineCurrentUser");
const cors = require("cors");

/** require Server from socket.io */
const { Server } =require('socket.io')

//the code below came from: https://stackoverflow.com/questions/9177049/express-js-req-body-undefined?answertab=modifieddesc#tab-top
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(defineCurrentUser);


/** create chat server via socket.io  */
const io = new Server({
  cors:{
    origin:"http://localhost:3000/myjobs",
    methods: ["GET", "POST"]
  }
})

//listen for socket connection

io.on('connection', (socket)=>{
  console.log(`User Connected: ${socket.id}`)

  //listen for users joining
  socket.on('join_room', (data)=>{
    socket.join(data)
    console.log(`User with socket id: ${socket.id} joined room ${data}`)
  })

  //listen for messages sent
  socket.on('send_message', (data)=>{
    socket.to(data.room).emit('receive_message', data)
  })

  //listen for disconnect
  socket.on('disconnect', ()=>{
    console.log(`User socket ${socket.id} has disconnected`)
  })

})

//end of webchat socket integration 


app.get("/", (req, res) => {
  res.send("running");
});

const memberAccount_controller = require("./controllers/memberAccount_controller");
app.use("/memberAccounts", memberAccount_controller);

const job_controller = require("./controllers/job_controller");
const { Server } = require("http");
app.use("/jobs", job_controller);

// const authentication_controller = require("./controllers/authentication");
// app.use("/authentication", authentication_controller);

app.listen(process.env.PORT, () => {
  console.log(`connected at port ${process.env.PORT}`);
});

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongo");
  }
);
