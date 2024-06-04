const express = require("express");
const router = express.Router();
const settingsController = require("../controller/settings/settingsController")

router.get("/getSettings",settingsController.getSettings)

router.patch("/patchSettings",settingsController.patchSettings)


module.exports = router;