// const express = require("express");
// const app = express();
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

const SocketServer = (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('joinComment', ({ message }) => {
    console.log(message);
    socket.broadcast.emit('responseCmt', message);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
  socket.on('joinNotificationRoom', (useId) => {
    socket.join(useId);
  });

  socket.on('send_notificaton', ({ userId, type, senderName, postId }) => {
    console.log(senderName + 'vừa gửi thông báo');
    io.to(userId).emit('receive_notification', { type, senderName, postId });
  });
};

module.exports = SocketServer;
