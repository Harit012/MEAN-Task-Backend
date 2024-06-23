const express = require("express");
const vehicleTypes = require("../controller/pricing/vehicleType");
const country = require("../controller/pricing/countryController");
const zone = require("../controller/pricing/zoneController");
const vehiclePricing = require("../controller/pricing/vehiclePricingController");
const middlewares = require("../middlewares/pricing");
const router = express.Router();

// admin/pricing/vehicle-type

router.get("/vehicle-type", vehicleTypes.getVehicle);

router.post("/vehicle-type",middlewares.postVehicleTypeParamsCheck, vehicleTypes.postVehicle);

router.put("/vehicle-type",middlewares.putVehicleTypeParamsCheck, vehicleTypes.putVehicle);

router.delete("/vehicle-type",middlewares.deleteVehicleTypeParamsCheck, vehicleTypes.deleteVehicle);

router.get("/vehicle-type/getAllTypes", vehicleTypes.getAllTypes);


// admin/ pricing/country

router.get("/country", country.getCountry);

router.post("/country",middlewares.postCountryParamsCheck, country.postCountry);

// admin/pricing/city

router.get("/city",middlewares.getZonesParamsCheck, zone.getZone);

router.post("/city",middlewares.postZoneParamsCheck, zone.postZone);

router.patch("/city",middlewares.patchZoneParamsCheck, zone.patchzone);


// admin/pricing/vehicle-pricing

router.get("/vehicle-pricing", vehiclePricing.getVehiclePricing);

router.post("/vehicle-pricing",middlewares.postVehiclePricingParamsCheck, vehiclePricing.postVehiclePricing);

router.patch("/vehicle-pricing",middlewares.patchVehiclePricingParamsCheck, vehiclePricing.patchVehiclePricing);

router.get("/vehicle-pricing/getAvailableTypes",middlewares.getTypesForPricingParamsCheck, vehicleTypes.getTypesForPricing);


module.exports = router;
