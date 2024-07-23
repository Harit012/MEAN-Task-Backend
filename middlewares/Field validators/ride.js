const { body, query } = require("express-validator");

exports.postVerifyUserValidationRules = () => {
  return [
    body("phone")
      .isLength({ max: 10, min: 10 })
      .withMessage("phone must be 10 digits long")
      .matches(/^[1-9]\d{9}$/)
      .withMessage("phone must be in digits and should not start with 0"),
  ];
};

exports.postCalculatePricingValidationRules = () => {
  return [
    body("distance").isNumeric().withMessage("distance must be a number"),
    body("time").isNumeric().withMessage("time must be a number and greater than or equal to 0"),
    body("zoneId").isMongoId().withMessage("zoneId must be a unique MongoId"),
  ];
}
exports.postCerateRideValidationRules = () => {
  return [
    body("userId").isMongoId().withMessage("userId must be a unique MongoId"),
    body("source").isString().withMessage("source must be a string"),
    body("destination").isString().withMessage("destination must be a string"),
    body("distance").isString().withMessage("distance must be a string"),
    body("time").isString().withMessage("time must be a string"),
    body("paymentmethod").isIn(["cash", "card"]).withMessage("paymentmethod must be (cash/card)"),
    body("serviceType").isString().withMessage("servieType must be a string"),
    body("ridetime").isString().withMessage("ridetime must be a string"),
    body("price").isNumeric().withMessage("price must be a number"),
    body("stops")
    .isArray()
    .withMessage("stops must be an array"),
    body("useremail").isEmail().withMessage("useremail must be an email"),
    body("username").isLength({ min: 3 }).withMessage("username must be at least 3 characters long"),
    body("userphone").matches(/^[1-9]\d{9}$/).withMessage("userphone must be in digits and should not start with 0"),
    body("rideType").isIn(["Scheduled","Now"]).withMessage("rideType must be (Scheduled/Now)"),
    body("endPoints")
    .isArray().withMessage("endPoints must be an array")
    // .custom((value)=>{
    //     if(typeof(value) == "object" && typeof(value.lat) == "number" && typeof(value.lng) == "number"){
    //         throw new Error('Array elements must be objects with {lat: number, lng: number}')
    //     }
    // })
    // .withMessage("End Pionts Array elements must be objects with {lat: number, lng: number}")
    ,

    body("stopPoints")
    .isArray()
    .withMessage("stopPoints must be an array")
    // .custom((value)=>{
    //     if(typeof(value) == "object" && typeof(value.lat) == "number" && typeof(value.lng) == "number"){
    //         throw new Error('Array elements must be objects with {lat: number, lng: number}')
    //     }
    // })
    // .withMessage("stops Array elements must be objects with {lat: number, lng: number}")
    ,
    body("sourceCity").isMongoId().withMessage("sourceCity must be a unique MongoId"),
  ]
}



// confirmed Rides

exports.getAllDriversValidationRules = () => {
    return [
        query("cityId").isMongoId().withMessage("cityId must be a unique MongoId"),
        query("serviceType").isString().withMessage("driverId must be a String"),
    ]
}

exports.patchCancleRideValidationRules = () => {
    return [
        body("rideId").isMongoId().withMessage("rideId must be a unique MongoId"),
    ]
}

exports.patchAssignDriverValidationRules = () => {
    return [
        body("rideId").isMongoId().withMessage("rideId must be a unique MongoId"),
        body("driverId").isMongoId().withMessage("driverId must be a unique MongoId"),
    ]
}