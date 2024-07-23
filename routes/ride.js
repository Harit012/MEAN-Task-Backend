const express = require("express");
const router = express.Router();
const createRideController = require("../controller/rides/create-ride");
const confirmRideController = require("../controller/rides/confirmed-ride");
const middlewares = require("../middlewares/Params check/ride");
const rules = require("../middlewares/Field validators/ride")
const {validate} = require("../middlewares/Field validators/login");

router.post("/create-ride/VerifyUser",middlewares.postVerifyUserParamsCheck,rules.postVerifyUserValidationRules(),validate,createRideController.postVerifyUserwithPhone);

router.post("/create-ride/calculate_pricings",middlewares.calculatePricingsParamsCheck,rules.postCalculatePricingValidationRules(),validate,createRideController.postCalculatePricing);

router.post("/create-ride/create-ride",middlewares.postCreateRideParamsCheck,rules.postCerateRideValidationRules(),validate,createRideController.postCreateRide);

// Confirmed Rides

router.get("/confirmed-ride/getAllDrivers",middlewares.getAllDriversParamsCheck,rules.getAllDriversValidationRules(),validate,confirmRideController.getAllDrivers);

router.get("/confirmed-ride/getRides",confirmRideController.getConfirmedRides)

router.patch("/confirmed-ride/cancel-ride",middlewares.patchCancleRideParamsCheck,confirmRideController.patchCancleRide)

router.patch("/confirmed-ride/assign-driver",middlewares.patchAsssignDriverParamsCheck,rules.patchAssignDriverValidationRules(),validate, confirmRideController.patchAssingDriver )

module.exports = router