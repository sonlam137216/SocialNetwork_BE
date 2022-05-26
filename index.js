const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const path = require('path');

const { ExpressPeerServer } = require('peer');

// socket server
const SocketServer = require('./socketServer');
const ChatServer = require('./chatServer');

const postRouter = require('./routes/postRouter');
const notiRouter = require('./routes/notiRouter');

const commentRouter = require('./routes/commentRouter');
const authRouter = require('./routes/authRouter');

const homeRouter = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');

const chatRouter = require('./routes/chatRouter');

const Comments = require('./model/commentModel');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

//socket
const http = require('http').createServer(app);
// const io = require('socket.io')(http)

const { Server } = require('socket.io');
const io = new Server(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('joinComment', (message) => {
        socket.join(message);
    });

    socket.on('send_message', (data) => {
        io.to(data.postId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });

    socket.on('joinNotificationRoom', (useId) => {
        socket.join(useId);
    });

    socket.on('send_notificaton', ({ userId, type, senderName, postId }) => {
        console.log(senderName + 'vừa gửi thông báo');
        io.to(userId).emit('receive_notification', { type, senderName, postId });
    });

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

    socket.on('sendDeleteMsg', (newMessage) => {
        io.to(newMessage.conversationId).emit('recieveDeleteMsg', newMessage);
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
        io.to(payload.userToSignal).emit('user joined', {
            signal: payload.signal,
            callerID: payload.callerID,
        });
    });

    socket.on('returning signal', (payload) => {
        io.to(payload.callerID).emit('receiving returned signal', {
            signal: payload.signal,
            id: socket.id,
        });
    });

    socket.on('IamCalling', (props) => {
        props.members.forEach((member) => {
            socket.broadcast.to(member._id).emit('recieveCalling', props.videoId);
        });
    });
});

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@19522133.i4x3b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

connectDB();

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/home', homeRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/noti', notiRouter);

ExpressPeerServer(http, { path: '/' });

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
