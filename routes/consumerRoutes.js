const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser")
const authorize = require("../middleware/authorize")
const { addConsumer, deleteConsumer, createRequest, loginConsumer } = require("../controllers/consumerControllers");


// User Route
router.route("/register").post(addConsumer);
router.route("/create-request").post(createRequest)
router.route("/:id").delete(deleteConsumer);
router.route("/login").post(loginConsumer)

// router.put("/update-user", userController.updateUser);

module.exports = router;
