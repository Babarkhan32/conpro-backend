const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");
router.get("/list", userController.getList);
router.post("/add-user", userController.addUser);
router.put("/update-user", userController.updateUser);
router.delete("/delete-user", userController.deleteUser);

module.exports = router;
