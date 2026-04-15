const express = require('express');
const { registerUser, loginUser ,logoutUser,getMe} = require('../controllers/auth.controller.js');
const {authUser}=require('../middlewares/auth.middleware.js');

const authRouter=express.Router();
 
authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);
authRouter.get('/logout',logoutUser);
authRouter.get('/get-me',authUser,getMe);

module.exports=authRouter;