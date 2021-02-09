const mongoose = require('mongoose')

const uri = "mongodb+srv://shivansh:dw8PVRm6GI0P0vqH@cluster0.nf8mx.mongodb.net/user_auth?retryWrites=true&w=majority"
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