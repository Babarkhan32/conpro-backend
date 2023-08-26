const express = require("express");
const router = express.Router();
const consumerRoute = require("./consumerRoutes");
const adminRoute = require("./adminRoutes");
const providerRoute = require("./providerRoutes");

router.use("/consumer", consumerRoute);
router.use("/admin", adminRoute)
router.use("/provider", providerRoute)

module.exports = router;
