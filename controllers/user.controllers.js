const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/userModel");
const Request = require("../models/requestSchema")


// Register a User
exports.addUser = catchAsyncErrors(async (req, res) => {

  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user
  })
})


// Delete a User
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

  const deletedUser = await User.findById(req.params.id)

  if (!deletedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  await User.deleteOne({ _id: deletedUser.id });

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  })});

// Creating User Request
exports.createRequest = catchAsyncErrors(async (req, res, next) => {

  const { consumerIdentifier, deadline, budget, taskDetails } = req.body;

  const consumer = await User.findOne({ email: consumerIdentifier });

  if (!consumer) {
    return next(new ErrorHandler("Consumer not Found", 400))
  }

  const newRequest = new Request({
    consumerIdentifier,
    deadline,
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
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email and Password", 400))
  }

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }
  sendToken(user, 200, res)

})
