const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullNmae: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
    }
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;