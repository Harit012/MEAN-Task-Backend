const { body, query } = require("express-validator");

exports.patchSettingsValidationRules = ()=>{
    return [
        body("timeOut").isInt().withMessage("timeOut must be a number"),
        body("stops").isInt({max:5}).withMessage("timeOut must be a number and less than or equal to 5"),
        body("mailerPassword").isString().withMessage("mailerPassword must be a String"),
        body("mailerUser").isString().withMessage("mailerPassword must be a String").isEmail().withMessage("mailerUser must be an email"),
        body("stripePublishableKey").isLength({min:107, max: 107}).withMessage("stripePublishableKey must be a String and 107 characters long"),
        body("stripeSecretKey").isLength({min:107, max: 107}).withMessage("stripeSecretKey must be a String and 107 characters long"),
        body("twilioAccountSid").isLength({min:34, max: 34}).withMessage("twilioAccountSid must be a String and 34 characters long"),
        body("twilioAuthToken").isLength({min:32, max: 32}).withMessage("twilioAuthToken must be a String and 32 characters long"),
        body("twilioPhoneNumber").matches('^[+][1-9]{1}[1-9]{1}[0-9]{9}$').withMessage("twilioPhoneNumber must be a String and in the format +1xxxxxxxxx"),
    ]
}