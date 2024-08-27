const { body, query } = require("express-validator");

// vehicle Type
exports.postVehicleTypeValidationRules = () => {
    return [
        body("type").isString().withMessage("vehicle type is required"),
    ];
}

exports.putVehicleTypeValidationRules = () => {
    return [
        body("type").isString().withMessage("vehicle type must be a String"),
        body("id").isMongoId().withMessage("id must be a unique MongoId"),
        body("prvImg").isString().withMessage("prvImg must be a String"),
    ]
}

exports.deleteVehicleTypeValidationRules = () => {
    return [
        query("id").isMongoId().withMessage("id must be a unique MongoId"),
    ]
}

// country

exports.postCountryValidationRules = () => {
    return [
        body("countryName").isString().withMessage("countryName must be a String"),
        body("currency").isString().withMessage("currency must be a String"),
        body("countryCallCode").isString().withMessage("countryCallCode must be a String"),
        body("FlagUrl").isString().withMessage("FlagUrl must be a String"),
        body("timezones").isArray().withMessage("timezones must be an Array"),
        body("countryShortName").isString().withMessage("countryShortName must be a String"),
    ]
}

// city / Zone

exports.getZoneValidationRules = () => {
    return [ 
        query("countryId").isMongoId().withMessage("countryId must be a unique MongoId"),
    ]
}

exports.postZoneValidationRules = () => {
    return [ 
        body("country").isMongoId().withMessage("country must be a unique MongoId"),
        body("zoneName").isString().withMessage("zoneName must be a String"),
        body("boundry").isArray().withMessage("boundry must be an Array"),
    ]
}

exports.patchZoneValidationRules = () => {
    return [
        body("id").isMongoId().withMessage("id must be a unique MongoId"),
        body("boundry").isArray().withMessage("boundry must be an Array"),
    ]
}

// vehicle pricing 

exports.postVehiclePricingValidationRules = () => {
    return [
        body("country").isMongoId().withMessage("country must be a unique MongoId"),
        body("city").isMongoId().withMessage("city must be a unique MongoId"),
        body("vehicleType").isString().withMessage("vehicleType must be a String"),
        body("driverProfit").isInt({max:100, min:0}).withMessage("driverProfit must be a number and less than or equal to 100"),
        body("minFare").isInt().withMessage("minFare must be a number"),
        body("distanceForBasePrice").isInt({max:5 , min:0}).withMessage("distanceForBasePrice must be a number and less than or equal to 5"),
        body("basePrice").isInt().withMessage("basePrice must be a number"),
        body("pricePerUnitDistance").isInt().withMessage("pricePerUnitDistance must be a number"),
        body("pricePerUnitTime").isInt().withMessage("pricePerUnitTime must be a number"),
        body("maxSpace").isInt().withMessage("maxSpace must be a number"),
        body("ccv").isString().withMessage("ccv must be a String"),
    ]
}

exports.patchVehiclePricingValidationRules = () => {
    return [
        body("_id").isMongoId().withMessage("id must be a unique MongoId"),
        body("driverProfit").isInt({max:100, min:0}).withMessage("driverProfit must be a number and less than or equal to 100"),
        body("minFare").isInt().withMessage("minFare must be a number"),
        body("distanceForBasePrice").isInt({max:5 , min:0}).withMessage("distanceForBasePrice must be a number and less than or equal to 5"),
        body("basePrice").isInt().withMessage("basePrice must be a number"),
        body("pricePerUnitDistance").isInt().withMessage("pricePerUnitDistance must be a number"),
        body("pricePerUnitTime").isInt().withMessage("pricePerUnitTime must be a number"),
        body("maxSpace").isInt().withMessage("maxSpace must be a number"),
    ]
}

exports.getVehiclePrivingValidationRules = () => {
    return [
        query("city").isMongoId().withMessage("id must be a unique MongoId"),
    ]
}