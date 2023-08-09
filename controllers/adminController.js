const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const User = require("../models/userModel");
const Request = require("../models/requestSchema")

// GET ALL USER
exports.getList = catchAsyncErrors(async (req, res) => {

  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
});

exports.viewRequests = catchAsyncErrors(async (req, res, next) => {

  const requests = await Request.find();

  res.status(200).json({
    success: true,
    requests
  })
})

exports.assignRequest = catchAsyncErrors(async(req,res,next) => {
  
})