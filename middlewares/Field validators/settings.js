const { body, query } = require("express-validator");

exports.patchSettingsValidationRules = ()=>{
    return [
        body("timeOut").isInt().withMessage("timeOut must be a number"),
        body("stops").isInt({max:5}).withMessage("timeOut must be a number and less than or equal to 5"),
    ]
}