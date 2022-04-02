const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@19521972-ie213.64d12.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

connectDB()

const app = express()

app.use(express.json())
app.use(cors())


// app.use('/api/post', authRouter)

const PORT = process.env.PORT || 3001 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))