const path = require('path');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const homeRouter = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');

const chatRouter = require('./routes/chatRouter');

const Message = require('./model/messageModel');
const User = require('./model/userModel');

require('dotenv').config();

const users = {};

const socketToRoom = {};
const app = express();
app.use(express.json());
app.use(cors());
const chatServer = http.createServer(app);
const io = new Server(chatServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    // console.log(socket.id + ' connected.')

    socket.on('joinMessenger', (id) => {
        socket.join(id);
    });

    socket.on('joinRoom', (id) => {
        socket.join(id);
    });

    socket.on('sendNotice', (members) => {
        members.forEach((member) => {
            io.to(member._id).emit('recieveNotice', member);
        });
    });

    socket.on('sendMessage', async (mess) => {
        io.to(mess.conversationId).emit('recieveMessage', mess);
    });

    socket.on('sendTym', (newMessage) => {
        io.to(newMessage.conversationId).emit('recieveTym', newMessage);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
    });

    // video call

    socket.on('join room', (roomID) => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit('room full');
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

        socket.emit('all users', usersInThisRoom);
    });

    socket.on('sending signal', (payload) => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returning signal', (payload) => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('IamCalling', (props) => {
        props.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('recieveCalling', props.videoId);
        });
    });

    socket.on('disconnect', (id) => {
        // console.log(socket.id + ' disconnected.')
        // users = users.filter((user) => user.userId !== socket.id);
        socket.disconnect();
    });
});

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/home', homeRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

// app.use('/api/post', authRouter)

const PORT = process.env.PORT || 3003;

chatServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
