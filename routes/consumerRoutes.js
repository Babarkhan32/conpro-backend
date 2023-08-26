const express = require("express");
const router = express.Router();
const { addConsumer, deleteConsumer, createRequest, } = require("../controllers/consumerControllers");


// User Route
router.route("/register").post(addConsumer);
router.route("/create-request").post(createRequest)
router.route("/:id").delete(deleteConsumer);



// router.route("/login").post(loginUser);

// router.put("/update-user", userController.updateUser);

module.exports = router;
