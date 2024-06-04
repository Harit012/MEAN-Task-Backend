const express = require("express");
const router = express.Router();
const driverController = require("../controller/driver/driverListController");

// driver-list routes

router.get("/list", driverController.getDrivers);

router.post("/list",driverController.postDriver);

router.delete("/list",driverController.deleteDriver);

router.put("/list",driverController.putDriver);

router.patch("/list",driverController.patchDriver);

router.patch("/list/serviceType",driverController.patchServiceType);


module.exports = router