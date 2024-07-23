const { body, query } = require("express-validator");

exports.getDriverValidationRules = () => {
  return [
    query("page")
      .isInt({ min: 0 })
      .withMessage("page must be a positive number"),

    query("input").isString().withMessage("input must be a string"),

    query("sort")
      .isIn(["email", "name", "none", "phone"])
      .withMessage("sort must be (none/name/email/phone)"),
  ];
};

exports.postAddDriverValidationRules = () => {
  return [
    // driverName Validation
    body("driverName")
      .isLength({ min: 3 })
      .withMessage("userName must be at least 3 characters long"),
    // email Validation
    body("driverEmail").isEmail().withMessage(`Email is not Formatted correctly`),
    // country Validation
    body("country").isMongoId().withMessage("country must be a unique MongoId"),
    // city Validation
    body("city").isMongoId().withMessage("city must be a unique MongoId"),
    // phone Validation
    body("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("phone must be 10 characters long")
      .matches(/^[1-9]\d{9}$/)
      .withMessage("phone must be in digits and should not start with 0"),
  ];
};

exports.deleteDriverValidationRules = () => {
  return [
    query("id").isMongoId().withMessage("id must be a unique MongoId"),
  ]
}

exports.patchDriverApprovalValidationRules = () => {
  return [
    body("id").isMongoId().withMessage("id must be a unique MongoId"),

    body("approvel").isBoolean().withMessage("approvel must be a boolean"),

  ]
}

exports.patchDriverServiceTypeValidationRules = () => {
  return [
    body("id").isMongoId().withMessage("id must be a unique MongoId"),

    body("serviceType").isString().withMessage("approvel must be a String"),

  ]
}

exports.putEditDriverValidationRules = () => {
  return [
    // id Validation
    body("id").isMongoId().withMessage("id must be a unique MongoId"),
    // driverName Validation
    body("driverName")
      .isLength({ min: 3 })
      .withMessage("userName must be at least 3 characters long"),
    // email Validation
    body("driverEmail").isEmail().withMessage(`Email is not Formatted correctly`),
    // country Validation
    body("country").isMongoId().withMessage("country must be a unique MongoId"),
    // city Validation
    body("city").isMongoId().withMessage("city must be a unique MongoId"),
    // phone Validation
    body("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("phone must be 10 characters long")
      .matches(/^[1-9]\d{9}$/)
      .withMessage("phone must be in digits and should not start with 0"),
    // profile Validation
    body("driverProfile")
      .isString()
      .withMessage("driverProfile must be a string"),
  ];
};

// running request 

exports.patchAcceptRideValidationRules = () => {
  return [
    body("rideId").isMongoId().withMessage("rideId must be a unique MongoId"),
  ]
}

exports.patchRideStatusChageValidationRules = () => {
  return [
    body("rideId").isMongoId().withMessage("rideId must be a unique MongoId"),
    body("status").isString().withMessage("status must be a string").isIn(["arrived", "picked", "started", "completed"]).withMessage("status must be (arrived/picked/started/completed)"),
  ]
}