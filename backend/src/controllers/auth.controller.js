const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');



const registerUser = async (req, res) => {
console.log('Body:', req.body);
console.log('Content-Type:', req?.get('Content-Type') || 'none');
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const isUserExist = await userModel.findOne({
            $or: [{ username: username }, { email: email }]
        });

        if (isUserExist) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // production me true
            sameSite: "lax"
        });
        res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, username: newUser.username, email: newUser.email }, token });



    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
console.log('Login Body:', req.body);
console.log('Login Content-Type:', req?.get('Content-Type') || 'none');
const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // production me true
            sameSite: "lax"
        });
        res.status(200).json({ message: 'User logged in successfully', user: { id: user._id, username: user.username, email: user.email }, token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const logoutUser = async (req, res) => {
    const token = req.cookies.token;
    console.log(req.cookies);
if (!token) {
        return res.status(400).json({ message: 'Token is not provided' });
    }
    try {
        const blacklistToken = new blacklistModel({ token });
        await blacklistToken.save();
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const getMe=async(req,res)=>{
    try{
        
        const user=await userModel.findById(req.user.userId);
        console.log('User from DB:', req.user);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.status(200).json({
            message:'User details fetched successfully',
            user:
            {
                id:user._id,
                username:user.username,
                email:user.email
            }
        }); 
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:'Server error'});
    }           
}






module.exports = { registerUser, loginUser, logoutUser,getMe };