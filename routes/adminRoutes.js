const express = require("express");
const router = express.Router();

const {getConsumerList, getProviderList, viewRequests, assignRequest, cancelRequest}  = require("../controllers/adminController")

// Admin Route
router.route("/consumer-list").get(getConsumerList); // Getting Consumer List only
router.route("/provider-list").get(getProviderList); // Getting Provider List only
router.route("/request-list").get(viewRequests); // Getting all the Requests
// router.route("/assign-task/:requestId/:providerId").post(assignRequest); // Assigning request to Provider
// router.route("/cancel-task/:requestId").post(cancelRequest); // Cancelling assigned request
// router.route("/admin/delete-task/:requestId").delete(deleteRequest); // Deleting request

module.exports = router;
