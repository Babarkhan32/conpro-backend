const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const Consumer = require("../models/consumerModel");
const Request = require("../models/requestModel")


// Register a Consumer
exports.addConsumer = catchAsyncErrors(async (req, res) => {

  const consumer = await Consumer.create(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    consumer
  })
})


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

  const { consumerIdentifier, deadline, budget, taskDetails } = req.body;

  const consumer = await Consumer.findOne({ email: consumerIdentifier });

  if (!consumer) {
    return next(new ErrorHandler("Consumer not Found", 400))
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










// LOGIN
// exports.loginUser = catchAsyncErrors(async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(new ErrorHandler("Please enter Email and Password", 400))
//   }

//   const user = await User.findOne({ email }).select("+password")

//   if (!user) {
//     return next(new ErrorHandler("Invalid Email or Password", 401))
//   }

//   const isPasswordMatched = await user.comparePassword(password);

//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Invalid Email or Password", 401))
//   }
//   sendToken(user, 200, res)

// })
