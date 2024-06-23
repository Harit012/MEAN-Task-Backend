const express = require("express");
const router = express.Router();
const driverController = require("../controller/driver/driverListController");
const middlewares = require("../middlewares/driver");

// driver-list routes

router.get("/list",middlewares.getDriversParamsCheck, driverController.getDrivers);

router.post("/list",middlewares.postDriversParamsCheck, driverController.postDriver);

router.delete("/list",middlewares.deleteDriverParamsCheck,driverController.deleteDriver);

router.put("/list",middlewares.putDriverParamsCheck,driverController.putDriver);

router.patch("/list",middlewares.patchDriverParamsCheck,driverController.patchDriver);

router.patch("/list/serviceType",middlewares.patchDriverServiceTypeParamsCheck, driverController.patchServiceType)
module.exports = router