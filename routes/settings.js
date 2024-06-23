const express = require("express");
const router = express.Router();
const settingsController = require("../controller/settings/settingsController")
const middlewares = require("../middlewares/setting");

router.get("/getSettings",settingsController.getSettings)

router.patch("/patchSettings",middlewares.patchSettingsParamsCheck, settingsController.patchSettings)

module.exports = router;