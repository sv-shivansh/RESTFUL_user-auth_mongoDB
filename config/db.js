const mongoose = require('mongoose')
//uri = mongobd uri e.g.= mongodb+srv://<username>:<user_password>@cluster0.nf8mx.mongodb.net/user_auth?retryWrites=true&w=majority 
const uri = ""
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