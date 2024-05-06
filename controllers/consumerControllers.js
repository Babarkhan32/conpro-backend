const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const Consumer = require("../models/consumerModel");
const Provider = require("../models/providerModel");
const Request = require("../models/requestModel");
const Notification = require("../models/notificationModel");
const sendToken = require("../utils/jwtToken");

exports.getConsumerProfile = catchAsyncErrors(async (req, res, next) => {
  const id = req.id;

  const consumer = await Consumer.findById(id);

  res.status(200).json({
    success: true,
    consumer,
  });
});

// Delete a Consumer
exports.deleteConsumer = catchAsyncErrors(async (req, res, next) => {
  const deletedConsumer = await Consumer.findById(req.params.id);

  if (!deletedConsumer) {
    return next(new ErrorHandler("User not found", 404));
  }

  await Consumer.deleteOne({ _id: deletedConsumer.id });

  res.status(200).json({
    success: true,
    message: "Consumer deleted successfully",
  });
});

exports.createRequest = catchAsyncErrors(async (req, res, next) => {
  const id = req.id;
  const { email, title, category, deadline, budget, taskDetails } = req.body;

  const consumer = await Consumer.findOne({ email });

  // Validate if consumer exists
  if (!consumer) {
    return next(new ErrorHandler("Consumer not found", 400));
  }

  // Validate category
  if (!category) {
    return next(new ErrorHandler("Invalid category", 400));
  }

  const date = new Date(deadline);

  const dateOnly = date.toDateString();
  const timeOnly = date.toLocaleTimeString();

  // Create a new request
  const newRequest = new Request({
    consumerID: id,
    email,
    title,
    category,
    deadline: dateOnly, 
    time:timeOnly,
    budget,
    taskDetails,
  });

  const savedRequest = await newRequest.save();

  // Assuming you are updating consumer's previous requests
  const prevTaskId = savedRequest._id.toString();
  consumer.prevRequests.push(prevTaskId);
  await consumer.save();

  res.status(201).json({
    success: true,
    savedRequest,
    message: "Request created successfully",
  });
});


exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
  const id = req.id;

  const notification = await Notification.find({ consumerId: id });

  res.status(200).json({
    success: true,
    notification,
  });
});

exports.getApprovedRequests = catchAsyncErrors(async (req, res, next) => {
  const consumerid = req.id;

  const consumer = await Consumer.findById(consumerid);

  const prevRequestsId = consumer.prevRequests.map((objectId) =>
    objectId.toString()
  );

  const requests = await Request.find({
    _id: {
      $in: prevRequestsId,
    },
    status: "approved",
    assignedRequest: "pending",
  });

  res.status(200).json({
    success: true,
    requests,
  });
});

exports.getAssignedRequests = catchAsyncErrors(async (req, res, next) => {
  const consumerid = req.id;

  const consumer = await Consumer.findById(consumerid);

  const prevRequestsId = consumer.prevRequests.map((objectId) =>
    objectId.toString()
  );

  const requests = await Request.find({
    _id: {
      $in: prevRequestsId,
    },
    status: "approved",
    assignedRequest: "assigned",
    completedStatus: "pending",
  });

  res.status(200).json({
    success: true,
    requests,
  });
});

exports.getCompletedRequests = catchAsyncErrors(async (req, res, next) => {
  const consumerid = req.id;

  const consumer = await Consumer.findById(consumerid);

  const prevRequestsId = consumer.prevRequests.map((objectId) =>
    objectId.toString()
  );

  const requests = await Request.find({
    _id: {
      $in: prevRequestsId,
    },
    status: "approved",
    assignedRequest: "assigned",
    completedStatus: "completed",
  });

  res.status(200).json({
    success: true,
    requests,
  });
});

exports.postReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;

  const consumerid = req.id; 
  const requestid = req.params.id;

  const request = await Request.findById(requestid);
  if (!request) {
    return next(new Error("Request not found"));
  }

  const providerid = request.assignedProviderId;

  const provider = await Provider.findById(providerid);
  if (!provider) {
    return next(new Error("Provider not found"));
  }

  // Check if the consumer has already reviewed the provider for this request
  const hasReviewed = provider.reviews.some((review) => {
    return review.consumerId.toString() === consumerid.toString();
  });


  if (hasReviewed) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this provider for the same request.",
    });
  }

  const newReview = {
    consumerId: consumerid, 
    rating,
    comment,
  };

  provider.reviews.push(newReview);

  await provider.save();

  res.status(200).json({
    success: true,
    message: "Review added successfully",
  });
});

exports.updateConsumerProfile = catchAsyncErrors(async (req, res, next) => {});
