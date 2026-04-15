const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// require all the routes here
const authRouter=require('./routes/auth.routes');
const interviewRouter=require('./routes/interview.routes');

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    // ✅ Yahan apna current frontend URL daalo (5174 wala)
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true, // Agar cookies use kar rahe ho toh zaroori hai
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// using all the routes here
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);


module.exports=app;