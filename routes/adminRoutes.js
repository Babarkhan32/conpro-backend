const express = require("express");
const router = express.Router();

const { getConsumerList, getProviderList, viewRequests, assignRequest,
    cancelRequest, deleteRequest, getUnAssignedRequests, deleteUser, getPendingRequests, validateRequest,
    addAdmin, getCompletedTasks, getAdmin,
    appliedProvidersList, 
    getAssignedRequests} = require("../controllers/adminController");
const { isAuthenticatedUser } = require("../middleware/auth");


// Admin Routes
router.route("/consumer-list").get(isAuthenticatedUser, getConsumerList);                            // Getting Consumer List only
router.route("/provider-list").get(isAuthenticatedUser, getProviderList);                           // Getting Provider List
router.route("/applied-providers-list/:id").get(isAuthenticatedUser, appliedProvidersList);         // Getting applied Provider List only
router.route("/request-list").get(isAuthenticatedUser, viewRequests);                                 // Getting all the Requests
router.route("/admin-list").get(isAuthenticatedUser, getAdmin);                                 // Getting all the Admins
router.route("/pending-request-list").get(isAuthenticatedUser, getPendingRequests);                  // Getting all the pending requests
router.route("/unassigned-request").get(isAuthenticatedUser, getUnAssignedRequests);                        // Getting all completed requests
router.route("/completed-request").get(getCompletedTasks);                        // Getting all completed requests
router.route("/assigned-request-list").get(getAssignedRequests)

router.route("/assign-task/:requestId/:providerId").post(isAuthenticatedUser, assignRequest);   // Assigning request to Provider
router.route("/registerAdmin").post(isAuthenticatedUser, addAdmin); // Add new admin

router.route("/validate-request/:id").put(isAuthenticatedUser,validateRequest)
router.route("/cancel-request/:id").put(cancelRequest)

router.route("/delete-task/:id").delete( deleteRequest); // Deleting request
router.route("/delete-user/:id").delete(isAuthenticatedUser, deleteUser); // Deleting User







module.exports = router;
