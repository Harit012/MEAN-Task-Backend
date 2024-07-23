const express = require("express");
const vehicleTypes = require("../controller/pricing/vehicleType");
const country = require("../controller/pricing/countryController");
const zone = require("../controller/pricing/zoneController");
const vehiclePricing = require("../controller/pricing/vehiclePricingController");
const middlewares = require("../middlewares/Params check/pricing");
const router = express.Router();
const {validate} = require("../middlewares/Field validators/login");
const rules = require("../middlewares/Field validators/pricing");

// admin/pricing/vehicle-type

router.get("/vehicle-type", vehicleTypes.getVehicle);

router.post("/vehicle-type",middlewares.postVehicleTypeParamsCheck,rules.postVehicleTypeValidationRules(),validate, vehicleTypes.postVehicle);

router.put("/vehicle-type",middlewares.putVehicleTypeParamsCheck,rules.putVehicleTypeValidationRules(),validate, vehicleTypes.putVehicle);

router.delete("/vehicle-type",middlewares.deleteVehicleTypeParamsCheck,rules.deleteVehicleTypeValidationRules(),validate, vehicleTypes.deleteVehicle);

router.get("/vehicle-type/getAllTypes", vehicleTypes.getAllTypes);


// admin/ pricing/country

router.get("/country", country.getCountry);

router.post("/country",middlewares.postCountryParamsCheck,rules.postCountryValidationRules(),validate, country.postCountry);

// admin/pricing/city

router.get("/city",middlewares.getZonesParamsCheck,rules.getZoneValidationRules(),validate, zone.getZone);

router.post("/city",middlewares.postZoneParamsCheck,rules.postZoneValidationRules(),validate, zone.postZone);

router.patch("/city",middlewares.patchZoneParamsCheck,rules.patchZoneValidationRules(),validate, zone.patchzone);


// admin/pricing/vehicle-pricing

router.get("/vehicle-pricing", vehiclePricing.getVehiclePricing);

router.post("/vehicle-pricing",middlewares.postVehiclePricingParamsCheck,rules.postVehiclePricingValidationRules(),validate, vehiclePricing.postVehiclePricing);

router.patch("/vehicle-pricing",middlewares.patchVehiclePricingParamsCheck,rules.patchVehiclePricingValidationRules(),validate, vehiclePricing.patchVehiclePricing);

router.get("/vehicle-pricing/getAvailableTypes",middlewares.getTypesForPricingParamsCheck,rules.getVehiclePrivingValidationRules(),validate, vehicleTypes.getTypesForPricing);


module.exports = router;
