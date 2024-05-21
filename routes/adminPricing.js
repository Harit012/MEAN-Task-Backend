const express = require("express");
const adminpricing = require("../controller/pricing/vehicleType");
const country = require("../controller/pricing/countryController");
const zone = require("../controller/pricing/zoneController");
const router = express.Router();

// admin/pricing/vehicle-type

router.get("/vehicle-type", adminpricing.getVehicle);

router.post("/vehicle-type", adminpricing.postVehicle);

router.put("/vehicle-type", adminpricing.putVehicle);

router.delete("/vehicle-type", adminpricing.deleteVehicle);

// admin/ pricing/country

router.get("/country", country.getCountry);

router.post("/country", country.postCountry);

// admin/pricing/city

router.get("/city", zone.getZone);

router.post("/city", zone.postZone);

router.patch("/city", zone.patchzone);

module.exports = router;
