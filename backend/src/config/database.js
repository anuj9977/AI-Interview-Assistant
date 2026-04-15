const mongoose = require('mongoose');

async function connectDB(){
    try{
        const database=await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
        console.log(`Connected to database: ${database.connection.name}`);
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;