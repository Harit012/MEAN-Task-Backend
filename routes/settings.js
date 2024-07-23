const express = require("express");
const router = express.Router();
const settingsController = require("../controller/settings/settingsController")
const middlewares = require("../middlewares/Params check/setting");
const rules = require("../middlewares/Field validators/settings");
let {validate} = require("../middlewares/Field validators/login");

router.get("/getSettings",settingsController.getSettings)

router.patch("/patchSettings",middlewares.patchSettingsParamsCheck,rules.patchSettingsValidationRules(),validate, settingsController.patchSettings)

module.exports = router;