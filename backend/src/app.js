const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// require all the routes here
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

const app = express();
const allowedOrigins = (
    process.env.FRONTEND_URLS ||
    'https://ai-interview-assistant-1-zxn9.onrender.com,http://localhost:5173,http://localhost:5174'
)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    // ✅ Yahan apna current frontend URL daalo (5174 wala)
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// using all the routes here
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);


module.exports = app;
