const express = require("express");
const router = express.Router();
const createRideController = require("../controller/rides/create-ride");
const confirmRideController = require("../controller/rides/confirmed-ride");
const middlewares = require("../middlewares/ride");


router.post("/create-ride/VerifyUser",middlewares.postVerifyUserParamsCheck,createRideController.postVerifyUserwithPhone);

router.get("/create-ride/getPricings",middlewares.getPricingsForCityParamsCheck,createRideController.getPricingsForCity);

router.post("/create-ride/calculate_pricings",middlewares.calculatePricingsParamsCheck,createRideController.postCalculatePricing);

router.post("/create-ride/create-ride",middlewares.postCreateRideParamsCheck,createRideController.postCreateRide);

// Confirmed Rides

router.get("/confirmed-ride/getRides",confirmRideController.getConfirmedRides)

router.patch("/confirmed-ride/cancel-ride",middlewares.patchCancleRideParamsCheck,confirmRideController.patchCancleRide)

router.patch("/confirmed-ride/assign-driver",middlewares.patchAsssignDriverParamsCheck, confirmRideController.patchAssingDriver )

module.exports = router