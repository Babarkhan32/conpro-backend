const express = require("express");
const router = express.Router();
const consumerRoute = require("./consumerRoutes");
const adminRoute = require("./adminRoutes");
const providerRoute = require("./providerRoutes");
const { loginUser, addUser, logoutUser, updateProfile,updatePassword, getProfile } = require("../controllers/mainController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const multer  = require('multer')
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})



router.use("/consumer", consumerRoute);
router.use("/admin", adminRoute)
router.use("/provider", providerRoute)
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route("/user/sign-up").post(addUser)
router.route("/my-profile").get(isAuthenticatedUser, getProfile)
router.route('/update-profile').post(isAuthenticatedUser, upload.single("avatar"), updateProfile);
router.route('/update-password').post(isAuthenticatedUser, updatePassword);


module.exports = router;
