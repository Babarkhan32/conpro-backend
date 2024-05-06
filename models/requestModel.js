
const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
  consumerID:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  time:{
    type: String
  },
  budget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  assignedRequest: {
    type: String,
    required: true,
    enum: ['pending', "assigned"],
    default: "pending"
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
    required: false,
  },
  category: {
    type: String,
    required: true,
    enum: ["Transportation", "Field Service", "IT Service", "Education", "Food Delivery"],
  },
  providerApplied: {
    type: [String],
    default: null
  },
  completedStatus: {
    type: String,
    required: true,
    enum: ["completed", "pending"],
    default: "pending"
  }

});

module.exports = mongoose.model("Request", requestSchema);
