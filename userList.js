const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type:String,
        require: true
    }
});

module.exports = mongoose.model('list', userListSchema);