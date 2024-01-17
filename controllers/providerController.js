const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const Provider = require("../models/providerModel")
const Request = require("../models/requestModel")

// REGISTER
exports.addProvider = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, category } = req.body;

  const provider = await Provider.create({ name, email, password, role: "provider", category });

  res.status(201).json({
    success: true,
    message: "Provider created successfully",
    provider,
  });
});


// Delete a Provider
exports.deleteProvider = catchAsyncErrors(async (req, res, next) => {

    const deletedProvider = await Provider.findById(req.params.id)
  
    if (!deletedProvider) {
      return next(new ErrorHandler("Provider not found", 404));
    }
  
    await Provider.deleteOne({ _id: deletedProvider.id });
  
    res.status(200).json({
      success: true,
      message: "Provider deleted successfully"
    })
  });

  // UPDATING A REQUEST AND ALSO PROVIDER HISTORY
  exports.completedRequest = catchAsyncErrors(async (req, res, next) => {
  const providerId = req.params.providerId;
  const requestId = req.params.requestId;

  const updatedRequest = await Request.findOneAndUpdate(
    { _id: requestId },
    { status: "completed", completedAt: new Date() },
    { new: true }
  );

  const updatedProvider = await Provider.findOneAndUpdate(
    { _id: providerId },
    {
      $inc: { completedTasksCount: 1 }, // Increment the completedTasksCount by 1
      $push: {
        taskHistory: {
          taskId: updatedRequest._id,
          completedAt: new Date(),
        },
      },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Request marked as completed and added to provider's taskHistory",
    updatedRequest,
    updatedProvider,
  });
});

  
  

  


  // exports.getProviderTaskHistory = catchAsyncErrors(async (req, res, next) => {
  //   const providerId = req.params.providerId;
  
  //   const provider = await Provider.findById(providerId).populate("taskHistory.taskId");
  
  //   if (!provider) {
  //     return next(new ErrorHandler("Provider not found", 404));
  //   }
  
  //   const taskHistory = provider.taskHistory;
  
  //   res.status(200).json({
  //     success: true,
  //     taskHistory: taskHistory,
  //   });
  // });