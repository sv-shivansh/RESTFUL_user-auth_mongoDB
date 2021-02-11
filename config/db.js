const mongoose = require('mongoose')
require('dotenv').config()

// takes the value from .env
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.nf8mx.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
const connectDB = async() =>{
    try{
        await mongoose.connect(uri,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
            useFindAndModify:false
        });
        console.log('MongoDB connected')
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;