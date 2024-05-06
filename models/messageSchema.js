const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    sender: {
        type:String,
    },
    receiver: {
        type:String,
    },
    content:{
        type:String,
    },
    timestamp:{
        type: Date,
    default: Date.now,
    }
});

// Create a model for messages
const Message = mongoose.model('Message', messageSchema);