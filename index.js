const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');

const homeRouter = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');

const chatRouter = require('./routes/chatRouter');

const Comments = require('./model/commentModel');

require('dotenv').config();

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

const app = express();

app.use(express.json());
app.use(cors());

let users = [];
// io.on('connection', (socket) => {
//     // console.log(socket.id + ' connected.')

//     socket.on('joinRoom', (id) => {
//         const user = { userId: socket.id, room: id };

//         const check = users.every((user) => user.userId !== socket.id);

//         if (check) {
//             users.push(user);
//             socket.join(user.room);
//         } else {
//             users.map((user) => {
//                 if (user.userId === socket.id) {
//                     if (user.room !== id) {
//                         socket.leave(user.room);
//                         socket.join(id);
//                         user.room = id;
//                     }
//                 }
//             });
//         }

//         // console.log(users)
//         // console.log(socket.adapter.rooms)
//     });

//     socket.on('createComment', async (msg) => {
//         const { content, user, postId, postUserId, createdAt, modifiedAt, send, parentCmt } = msg;

//         const newComment = new Comments({
//             content,
//             reply: [],
//             parent: 'x',
//             likes: [],
//             user,
//             postId,
//             postUserId,
//             createdAt,
//             modifiedAt,
//         });

//         if (send === 'replyComment') {
//             const { _id, content, reply, parent, likes, user, postId, postUserId, createdAt, modifiedAt } = newComment;

//             const comment = await Comments.findById(mongoose.Types.ObjectId(parentCmt));

//             if (comment) {
//                 comment.reply.push({ reply: parentCmt });

//                 await newComment.save();
//                 await comment.save();
//                 io.to(comment.postId).emit('sendReplyCommentToClient', comment);
//             }
//         } else {
//             await newComment.save();
//             io.to(newComment.postId).emit('sendCommentToClient', newComment);
//         }
//     });

//     socket.on('disconnect', () => {
//         // console.log(socket.id + ' disconnected.')
//         users = users.filter((user) => user.userId !== socket.id);
//     });
// });

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/home', homeRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

// app.use('/api/post', authRouter)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
