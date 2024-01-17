const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const Consumer = require("../models/consumerModel");
const Request = require("../models/requestModel")
const sendToken = require("../utils/jwtToken")


// // Register a Consumer
// exports.addConsumer = catchAsyncErrors(async (req, res) => {

//   const user = await Consumer.create(req.body);

//   sendToken(user,201,res)
// })

exports.addConsumer = catchAsyncErrors(async(req,res,next)=>{

  const {name, email, password} = req.body;

  const user = await Consumer.create({
      name,email,password
  });

  res.status(201).json({
    success: true,
    message: "Consumer created successfully",
    user,
  });})


// Delete a Consumer
exports.deleteConsumer = catchAsyncErrors(async (req, res, next) => {

  const deletedConsumer = await Consumer.findById(req.params.id)

  if (!deletedConsumer) {
    return next(new ErrorHandler("User not found", 404));
  }

  await Consumer.deleteOne({ _id: deletedConsumer.id });

  res.status(200).json({
    success: true,
    message: "Consumer deleted successfully"
  })
});

// Creating Consumer Request
exports.createRequest = catchAsyncErrors(async (req, res, next) => {

  const { consumerIdentifier, catagory, deadline, budget, taskDetails } = req.body;

  const consumer = await Consumer.findOne({ email: consumerIdentifier });

  // Validation for Consumer
  if (!consumer) {
    return next(new ErrorHandler("Consumer not Found", 400))
  }

  // Validation for catagory
  if(!catagory || !isValidCatagory(catagory)){
    return next(new ErrorHandler("Invalid Category", 400));

  }
  // VALIDATION FOR DEADLINE TIME
  const now = new Date();
  const minimumDeadline = new Date(now.getTime() + 1 * 60 * 60 * 1000); // Adding 1 hour

  const providedDeadline = new Date(deadline);

  if (providedDeadline <= minimumDeadline) {
    return next(new ErrorHandler("Invalid Deadline", 400));
  }

  const newRequest = new Request({
    consumerIdentifier,
    catagory,
    deadline: providedDeadline,
    budget,
    taskDetails,
  })

  const savedRequest = await newRequest.save();

  res.status(201).json({
    success: true,
    savedRequest
  })

})

// Login for Consumer 
exports.loginConsumer = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email and Password", 400))
  }

  const consumer = await Consumer.findOne({ email }).select("+password")

  const isPasswordMatched = await consumer.comparePassword(password);

  if (!consumer || !isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }
  console.log("does it reach here")

  return sendToken(consumer, 200, res);

})

function isValidCatagory(catagory){
  // Checking for predefined catagories
  const validCategories = ["Transportation", "Field Service", "IT Support", "Education", "Food Delivery"];
  return validCategories.includes(category);
}