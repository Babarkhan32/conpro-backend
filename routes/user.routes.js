const express = require("express");
const router = express.Router();
const { addUser, createRequest, } = require("../controllers/user.controllers");
const {getList, viewRequests}  = require("../controllers/adminController")



// User Route
router.route("/register").post(addUser);
router.route("/create-request").post(createRequest)

// Admin Route
router.route("/admin/user-list").get(getList);
router.route("/admin/request-list").get(viewRequests);



// router.route("/login").post(loginUser);

// router.put("/update-user", userController.updateUser);
// router.route("/:id").delete(deleteUser);

module.exports = router;
