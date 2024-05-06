const express = require("express")
const {getRequests ,  deleteProvider, updateRequeststatus, applyOfProvider ,assignedTasksList, getNotifications,getProviderProfile} = require("../controllers/providerController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router()

router.route("/delete/:id").delete(deleteProvider);         // DELETE PROVIDER

router.route("/update-request-status/:id").put(isAuthenticatedUser, updateRequeststatus)

router.route("/available-requests").get(isAuthenticatedUser, getRequests); 

router.route("/provider-me").get(isAuthenticatedUser, getProviderProfile); 

router.route("/apply-for-request/:id").put(isAuthenticatedUser, applyOfProvider)

router.route("/assigned-tasks-list").get(isAuthenticatedUser, assignedTasksList)

router.route("/notification-list").get(isAuthenticatedUser, getNotifications)





module.exports = router