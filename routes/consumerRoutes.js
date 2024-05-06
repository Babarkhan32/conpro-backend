const express = require("express");
const router = express.Router();
const {
  deleteConsumer,
  createRequest,
  updateConsumerProfile,
  getConsumerProfile,
  getNotifications,
  getApprovedRequests,
  getAssignedRequests,
  getCompletedRequests,
  postReview,
} = require("../controllers/consumerControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// User Route
router.route("/create-request").post(isAuthenticatedUser, createRequest); // Requires authentication
router.route("/:id").delete(deleteConsumer); // Requires authentication

router.route("/profile-me").get(isAuthenticatedUser, getConsumerProfile); // Requires authentication

router.route("/profile-me").put(isAuthenticatedUser, updateConsumerProfile);

router.route("/notification-list").get(isAuthenticatedUser, getNotifications);

router
  .route("/approved-requests")
  .get(isAuthenticatedUser, getApprovedRequests);

router
  .route("/assigned-requests")
  .get(isAuthenticatedUser, getAssignedRequests);

router
  .route("/completed-requests")
  .get(isAuthenticatedUser, getCompletedRequests);

router.route("/review/:id").post(isAuthenticatedUser, postReview);

// router.put("/update-user", userController.updateUser);

module.exports = router;
