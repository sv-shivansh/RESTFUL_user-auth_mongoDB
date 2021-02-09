const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'allUser'
    },
    googleId:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user-google',UserSchema);