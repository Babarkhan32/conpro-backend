const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Request",
        required: true
    },
    consumerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Consumer",
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Notification", NotificationSchema);
