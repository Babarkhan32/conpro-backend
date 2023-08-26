const express = require("express")
const { addProvider, deleteProvider, completedRequest } = require("../controllers/providerController")


const router = express.Router()

router.route("/register").post(addProvider);                // REGISTER PROVIDER
router.route("/delete/:id").delete(deleteProvider);         // DELETE PROVIDER
router.route("/:providerId/requests/:requestId/complete").put(completedRequest)



module.exports = router