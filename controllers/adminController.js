const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const Consumer = require("../models/consumerModel");
const Request = require("../models/requestModel")
const Provider = require("../models/providerModel")

// GET ALL USER
exports.getConsumerList = catchAsyncErrors(async (req, res) => {

  const consumers = await Consumer.find();

  res.status(200).json({
    success: true,
    consumers
  })
});

// GET ALL Providers
exports.getProviderList = catchAsyncErrors(async (req, res) => {

  let providers = await Provider.find();

  res.status(200).json({
    success: true,
    providers
  })
});

// GETTING ALL REQUESTS
exports.viewRequests = catchAsyncErrors(async (req, res, next) => {

  let requests = await Request.find();

  res.status(200).json({
    success: true,
    requests
  })
})


// TASK ASSIGNED TO PRODUCER

exports.assignRequest = catchAsyncErrors(async (req, res, next) => {

  const requestId = req.params.requestId;
  const providerId = req.params.providerId;

  // Basic validation: Check if requestId and providerId are provided in the query
  if (!requestId || !providerId) {
    return next(new ErrorHandler("Both requestId and providerId are required", 400));
  }

  const request = await Request.findById(requestId)
  const provider = await Provider.findById(providerId)

  if (!request) {
    return next(new ErrorHandler("Request  not found", 404))
  }

  if (!provider) {
    return next(new ErrorHandler("Provider  not found", 404))
  }

  if (request.status !== "pending") {
    return next(new ErrorHandler("Request is aleady assigned", 400))
  }

  request.status = "assigned";
  request.assignedProviderId = providerId;
  await request.save();

  res.status(200).json({
    success: true,
    message: "Task assigned successfully"
  })
})

// CANCEL TASK 

exports.cancelRequest = catchAsyncErrors(async (req, res, next) => {

  const request = await Request.findById(req.params.requestId)

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.status !== "assigned") {
    return next(new ErrorHandler("Request is not assigned", 400));
  }

  request.status = "pending";
  request.assignedProviderId = null;
  await request.save();

  res.status(200).json({
    success: true,
    message: "Task assignment cancelled successfully "
  })
})

// DELETE TASK

// exports.deleteRequest = catchAsyncErrors(async(req,res,next)=> {

// const request = await Request.findById(req.params.requestId)

// if(!request){
//   return next(new ErrorHandler("Request not found", 404))
// }
// console.log(request)
// request.remove()  // Remove the request

// res.status(200).json({
//   success:true,
//   message:"Request deleted successfully"
// })

// })