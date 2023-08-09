const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
  consumerIdentifier: {
        type: String, 
        required: true,
    },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  assignedProducerId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  taskDetails: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Request", requestSchema);
