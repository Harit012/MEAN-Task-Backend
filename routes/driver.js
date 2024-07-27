const express = require("express");
const router = express.Router();
const driverController = require("../controller/driver/driverListController");
const runningRequestController = require("../controller/driver/running-requestController")
const middlewares = require("../middlewares/Params check/driver");
let {validate} = require("../middlewares/Field validators/login");
let rules = require("../middlewares/Field validators/driver");

// driver-list routes

router.get("/list",middlewares.getDriversParamsCheck,rules.getDriverValidationRules(),validate, driverController.getDrivers);

router.post("/list",middlewares.postDriversParamsCheck,rules.postAddDriverValidationRules(),validate, driverController.postDriver);

router.delete("/list",middlewares.deleteDriverParamsCheck,rules.deleteDriverValidationRules(),validate,driverController.deleteDriver);

router.put("/list",middlewares.putDriverParamsCheck,rules.putEditDriverValidationRules(),validate,driverController.putDriver);

router.patch("/list",middlewares.patchDriverParamsCheck,rules.patchDriverApprovalValidationRules(),validate,driverController.patchDriver);

router.patch("/list/serviceType",middlewares.patchDriverServiceTypeParamsCheck,rules.patchDriverServiceTypeValidationRules(),validate, driverController.patchServiceType)

// Running Requests

router.get("/running-request/getRidesForRunningRequest",runningRequestController.getRunningRequest)

router.patch("/running-request/accept-ride",middlewares.patchAcceptRideParamsCheck,rules.patchAcceptRideValidationRules(),validate,runningRequestController.patchAcceptRide )

router.patch("/running-request/statusChange",middlewares.patchStatusChange,rules.patchRideStatusChageValidationRules(),validate,runningRequestController.patchStatusChange )

router.patch("/running-request/remove-driver",middlewares.patchAcceptRideParamsCheck,rules.patchAcceptRideValidationRules(),validate,runningRequestController.patchDeleteDriver)

router.patch("/running-request/bolck-driver",middlewares.patchBlockDriverParamsCheck,rules.patchBlockDriverValidationRules(),validate,runningRequestController.patchBlockDriver)
module.exports = router