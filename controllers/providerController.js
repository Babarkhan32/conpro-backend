const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const Provider = require("../models/providerModel")
const Request = require("../models/requestModel")
const Notification = require("../models/notificationModel")
const sendToken = require("../utils/jwtToken")

exports.applyOfProvider = catchAsyncErrors(async(req,res,next) => {

  const providerID = req.id
  const requestID = req.params.id

  
    try {
      const provider = await Provider.findById(providerID);
      const request = await Request.findById(requestID);

      if(!request){
        return next(new ErrorHandler("Request not found", 404))
      }

      if(provider.category !== request.category){
        return next(new ErrorHandler("You are not registered in this category", 400))
      }

      if(request.providerApplied.includes(providerID)){
        return next(new ErrorHandler("Provider already applied for this Request"), 400)
      }

      request.providerApplied.push(providerID);

      request.save((err) =>{
        if(err) return console.log(err)
      });

      res.status(200).json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  })

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

  // Getting All Requests for revelent Provider
  exports.getRequests = catchAsyncErrors(async(req,res,next) => {

    const providerID = req.id

    const provider = await Provider.findById(providerID)

    const category = provider.category

    const requests = await Request.find({category: category, status:"approved", assignedRequest:"pending"})

    res.status(200).json({
      success:true,
      requests,
    })
  })
  

// UPDATING A REQUEST WITHOUT ADDING TO PROVIDER HISTORY
exports.updateRequeststatus = catchAsyncErrors(async (req, res, next) => {

  const providerId = req.id
  const requestId = req.params.id

  try {
      const updatedRequest = await Request.findOneAndUpdate(
          { _id: requestId },
          { completedStatus: "completed", completedAt: new Date() },
          { new: true }
      );

      if (!updatedRequest) {
          return next(new ErrorHandler("Request not found", 404))
      }

      // Validate if providerId is provided and valid (you can add more validations here)
      if (!providerId && !requestId ) {
          return next(new ErrorHandler("Request ID and Provider ID is required", 400))
      }

      res.status(200).json({
          success: true,
          message: "Request marked as completed",
          updatedRequest,
      });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

exports.assignedTasksList = catchAsyncErrors(async(req,res,next) => {

    const providerId = req.id

    const provider = await Provider.findById(providerId)

    const requestID = provider.assignedTasks

    const requests = await Request.find({
      id: {
        $in: requestID
      },
      assignedProviderId: providerId,
      completedStatus:"pending"
    });
    
    res.status(200).json({
      success:true,
      requests
    })
})

exports.getNotifications = catchAsyncErrors(async(req,res,next) => {

  const id = req.id

  const notification = await Notification.find({providerId:id})

  res.status(200).json({
    success:true,
    notification
  })
})

exports.getProviderProfile = catchAsyncErrors(async(req,res,next) => {
  const id = req.id

  const provider = await Provider.findById(id)

  res.status(200).json({
    success:true,
    provider
  })
})



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