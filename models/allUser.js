const mongoose = require('mongoose');

const AllUserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    isAuthor:{
        type: Boolean,
        default: false
    },
    isOAuth:{
        type: Boolean,
        default: false
    }
})

module.exports = allUser = mongoose.model('allUser',AllUserSchema);