import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './routes/Routes.js'
import cookieParser from 'cookie-parser'
import path from 'path'

// dotenv config
dotenv.config()

// Directory
const __dirname = path.resolve()

// Initialize express server
const qserver = express()

// Parse json
qserver.use(express.json())

// Use cookie parser
qserver.use(cookieParser())

// Connect to Mongoose
mongoose.connect(process.env.DATABASE).then(() => {
    console.log('MongoDB Atlas connected to Quibble server');
}).catch((err) => {
    console.log(`MongoDB connection failed!! error:${err}`);
})

// Use routes
qserver.use('/qserver', router)

// Use directory
qserver.use(express.static(path.join(__dirname, '/quibble/dist')))

qserver.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'quibble', 'dist', 'index.html'))
})

// Select Port
const PORT = 3000 || process.env.PORT

qserver.listen(PORT, () => {
    console.log(`Quibble Server running at Port ${PORT} and waiting for client request!`);
})

qserver.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    res.status(statusCode).json({
        succes: false,
        statusCode,
        message,
    })
})