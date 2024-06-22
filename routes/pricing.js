const express = require("express");
const vehicleTypes = require("../controller/pricing/vehicleType");
const country = require("../controller/pricing/countryController");
const zone = require("../controller/pricing/zoneController");
const vehiclePricing = require("../controller/pricing/vehiclePricingController");
const router = express.Router();

// admin/pricing/vehicle-type

router.get("/vehicle-type", vehicleTypes.getVehicle);

router.post("/vehicle-type", vehicleTypes.postVehicle);

router.put("/vehicle-type", vehicleTypes.putVehicle);

router.delete("/vehicle-type", vehicleTypes.deleteVehicle);

router.get("/vehicle-type/getAllTypes", vehicleTypes.getAllTypes);


// admin/ pricing/country

router.get("/country", country.getCountry);

router.post("/country", country.postCountry);

// admin/pricing/city

router.get("/city", zone.getZone);

router.post("/city", zone.postZone);

router.patch("/city", zone.patchzone);


// admin/pricing/vehicle-pricing

router.get("/vehicle-pricing", vehiclePricing.getVehiclePricing);

router.post("/vehicle-pricing", vehiclePricing.postVehiclePricing);

router.patch("/vehicle-pricing", vehiclePricing.patchVehiclePricing);

router.get("/vehicle-pricing/getAvailableTypes", vehicleTypes.getTypesForPricing);


module.exports = router;
