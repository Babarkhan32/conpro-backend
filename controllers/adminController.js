const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorhandler")
const Consumer = require("../models/consumerModel");
const Request = require("../models/requestModel")
const Provider = require("../models/providerModel")
const sendToken = require("../utils/jwtToken");
const Notification = require("../models/notificationModel")


// Add Admin
exports.addAdmin = catchAsyncErrors(async (req, res, next) => {

  const { name, email, password } = req.body;

  const admin = await Consumer.create({
    name, email, password, role: "admin"
  })
  sendToken(admin, 201, res)
})

// GET ALL USER
exports.getConsumerList = catchAsyncErrors(async (req, res) => {

  const consumers = await Consumer.find({ role: "consumer" });

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

// GET ALL Providers based on query
exports.appliedProvidersList = catchAsyncErrors(async (req, res) => {

  const requestId = req.params.id

  const request = await Request.findById(requestId)

  const providersID = request.providerApplied

  const providers = await Provider.find({
    _id: {
      $in: providersID
    }
  });

  res.status(200).json({
    success: true,
    providers
  })
});

// GETTING ALL REQUESTS

exports.viewRequests = catchAsyncErrors(async (req, res, next) => {
  try {

    const requests = await Request.find({ status: "pending", assignedRequest: "pending" });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    // Handle any errors here
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

// Getting all the pending requests 

exports.getPendingRequests = catchAsyncErrors(async (req, res, next) => {
  const { category, status } = req.body;

  if (!category && !status) {
    return next(new ErrorHandler("Category and Status is required", 404))
  }

  const pendingRequest = await Request.find({ category: category, status: status })

  res.status(200).json({
    success: true,
    pendingRequest
  })
});

// Validate Requests
exports.validateRequest = catchAsyncErrors(async (req, res, next) => {


  const requestid = req.params['id']; // Accessing the value using bracket notation

  const request = await Request.findById(requestid)

  const consumerid = request.consumerID

  const consumer = await Consumer.findById(consumerid)

  // Update the status of the request
  const updatedRequest = await Request.findByIdAndUpdate(requestid, { status: "approved" }, { new: true });

  if (!updatedRequest) {
    return next(new ErrorHandler("Request not found", 404))
  }

  const consumerNotification = new Notification({
    consumerId: consumerid,
    requestId: requestid,
    message: `Your task "${request.title}" has been approved by Administrator`,
});

  
  await consumerNotification.save();


  const requests = await Request.find({ status: "pending" })

  res.status(200).json({
    success: true,
    requests
  })

})

exports.assignRequest = catchAsyncErrors(async (req, res, next) => {

  const requestId = req.params.requestId;
  const providerId = req.params.providerId;

  if (!requestId || !providerId) {
    return next(new ErrorHandler("Both requestId and providerId are required", 400));
  }

  const request = await Request.findById(requestId);
  const provider = await Provider.findById(providerId);

  const consumerId = request.consumerID

  if (!request || !provider) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.assignedRequest !== "pending") {
    return next(new ErrorHandler("Request is already assigned", 400));
  }

  request.assignedRequest = "assigned";
  request.assignedProviderId = providerId;
  provider.assignedTasks.push(requestId);

  const providerNotification = new Notification({
    providerId: providerId,
    requestId: requestId,
    message: `A new request is assigned to you by Administrator. "${request.title}"`,
});

const consumerNotification = new Notification({
    consumerId: consumerId,
    requestId: requestId,
    message: `Your task "${request.title}" has been assigned to a provider`,
});


await providerNotification.save();
await consumerNotification.save();


  await request.save();
  await provider.save();

    res.status(200).json({
    success: true,
    message: "Task assigned successfully"
  });
});


// CANCEL TASK 

exports.cancelRequest = catchAsyncErrors(async (req, res, next) => {

  const requestid = req.params.id

  const request = await Request.findById(requestid)

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.assignedRequest !== "assigned") {
    return next(new ErrorHandler("Request is not assigned", 400));
  }

  request.assignedRequest = "pending";
  request.assignedProviderId = null;
  await request.save();

  res.status(200).json({
    success: true,
    message: "Task assignment cancelled successfully "
  })
})

// GET TASKS WHICH  ARE MARKED COMPLETED

exports.completedRequest = catchAsyncErrors(async (req, res, next) => {

  const completedRequest = Request.find({ completedStatus: "completed" })

  res.status(200).json({
    success: true,
    completedRequest
  })
})

// Getting Requests which are unassigned to Providers
exports.getUnAssignedRequests = catchAsyncErrors(async (req, res, next) => {

  const requests = await Request.find({ status: "approved", assignedRequest: "pending" })

  if (!requests) {
    return next(new ErrorHandler("No Requests are found", 404))
  }

  res.status(200).json({
    success: true,
    requests
  })
})

// DELETE USER 

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

  try {

    const id = req.params['id']; // Accessing the value using bracket notation


    const consumer = await Consumer.findById(id)
    const provider = await Provider.findById(id)

    if (consumer) {
      consumer.remove()
    } else {
      provider.remove()
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully"

    })
  } catch (err) {
    console.log("Error found", err)
  }
})


// DELETE TASK

exports.deleteRequest = catchAsyncErrors(async (req, res, next) => {

  try {

    const requestid = req.params['id']; // Accessing the value using bracket notation

    const request = await Request.findById(requestid)

    const consumerid = request.consumerID


    if (!request) {
      return next(new ErrorHandler("Request not found", 404))
    }
    const consumerNotification = new Notification({
      consumerId: consumerid,
      requestId: requestid,
      message: `Your task "${request.title}" has been deleted by Administrator`,
  });
  
    await consumerNotification.save();
  
    request.remove()  // Remove the request

    res.status(200).json({
      success: true,
      message: "Request deleted successfully"
    })

  } catch (err) {
    console.log("Error", err)
  }
})


// Getting Requests which are marked completed by Providers

exports.getCompletedTasks = catchAsyncErrors(async (req, res, next) => {

  const requests = await Request.find({ completedStatus: "completed" });

  const providerID = requests.assignedProviderId

  const provider = await Provider.find({
    id: {
      $in: providerID
    }
  })

  res.status(200).json({
    success: true,
    requests,
    provider
  });
});

// Getting all the Admins
exports.getAdmin = catchAsyncErrors(async (req, res, next) => {

  const admins = await Consumer.find({ role: "admin" })

  res.status(200).json({
    success: true,
    admins
  })
})

// Getting all the Assigned Requests
exports.getAssignedRequests = catchAsyncErrors(async(req,res,next) => {

  const requests = await Request.find({assignedRequest:"assigned", completedStatus:"pending"})

  res.status(200).json({
    success:true,
    requests
  })
})  