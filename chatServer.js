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

// const connectDB = async () => {
//     try {
//         await mongoose.connect(
//             `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@19522133.i4x3b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
//             {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//             }
//         );

//         console.log('MongoDB connected');
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// };

// connectDB();
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

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
    });

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from, name: data.name });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

    socket.emit('me', socket.id);

    // socket.on('disconnect', (id) => {
    //     // console.log(socket.id + ' disconnected.')
    //     // users = users.filter((user) => user.userId !== socket.id);
    // });
});

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/home', homeRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

// app.use('/api/post', authRouter)

const PORT = process.env.PORT || 3002;

chatServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
