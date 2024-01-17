
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
  assignedProviderId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  taskDetails: {
    type: String,
    required: true,
  },
  requestType: {
    type: String, 
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Transportation", "Field Service", "IT Support", "Education", "Food Delivery"],
  },
});

module.exports = mongoose.model("Request", requestSchema);
