const express = require("express");
const router = express.Router();
const rideController = require("../controller/rides/create-ride");
const middlewares = require("../middlewares/ride");


router.post("/create-ride/VerifyUser",middlewares.postVerifyUserParamsCheck,rideController.postVerifyUserwithPhone);

router.get("/create-ride/getPricings",middlewares.getPricingsForCityParamsCheck,rideController.getPricingsForCity);

module.exports = router