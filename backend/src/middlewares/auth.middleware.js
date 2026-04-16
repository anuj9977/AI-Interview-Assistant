const jwt =require('jsonwebtoken');
const blacklistModel=require('../models/blacklist.model.js');

async function authUser  (req,res,next){
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null;
    const token = req.cookies.token || bearerToken;
    if(!token){
        return res.status(401).json({message:'No token provided'});
    }
    const isBlacklisted= await blacklistModel.findOne({token:token});
    if(isBlacklisted){
        return res.status(401).json({message:'Token is invalid'});
    } 
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
       
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({message:'Invalid token'});
    }   
}

module.exports={authUser};
