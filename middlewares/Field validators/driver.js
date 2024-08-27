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
    query("driver_stripe_id").matches(/^acct_[a-zA-Z0-9]{16}$/).withMessage("AccountId is not Valid")
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
    body("oldDriverProfile")
      .isString()
      .withMessage("oldDriverProfile must be a string"),
  ];
};

exports.postAddBankAccountValidationRules = () => {
  return [
    body("driverId").isMongoId().withMessage("driverId must be a unique MongoId"),
    body("accountNumber").matches(/[0-9]{12}/).withMessage("accountNumber must 12 digits long").isString().withMessage("accountHolderName must be a string"),
    body("routingNumber").matches(/[0-9]{9}/).withMessage("routingNumber must 9 chaaracters long").isString().withMessage("routingNumber must be a string"),
  ]
}

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

exports.patchBlockDriverValidationRules = () => {
  return [
    body("driverId").isMongoId().withMessage("driverId must be a unique MongoId"),
    body("rideId").isMongoId().withMessage("rideId must be a unique MongoId"),
  ]
}

exports.patchDriverResponseValidationRules = () => {
  return [
    body("response").isInt({max:1, min:0}).withMessage("response must be a number and less than or equal to 1"),
    body("rideId").isMongoId().withMessage("rideId must be a unique MongoId"),
  ]
}

exports.patchCompleteRideValidationRules = () => {
  return [
    body("rideId").isMongoId().withMessage("rideId must be a unique MongoId"),
  ]
}

exports.postPaymentProcessValidationRules = () => {
  return [
    body("id").isMongoId().withMessage("id must be a unique MongoId"),
    body("driver_stripe_id").matches(/^acct_[a-zA-Z0-9]{16}$/).withMessage("Driver AccountId is not Valid"),
    body("customerId").matches(/^cus_[a-zA-Z0-9]{14}$/).withMessage("customer AccountId is not Valid"),
    body("destination").isString().withMessage("destination must be a string"),
    body("source").isString().withMessage("source must be a string"),
    body("rideTime").isString().withMessage("rideTime must be a string"),
    body("userName").isString().withMessage("userName must be a string"),
    body("time").isString().withMessage("time must be a string"),
    body("paymentMethod").isIn(["card", "cash"]).withMessage("paymentMethod must either (card/cash)"),
    body("serviceType").isString().withMessage("serviceType must string"),
    body("price").isNumeric().withMessage("price must be a positive number"),
    body("driverName").isString().withMessage("driverName must string"),
    body("driverProfit").isNumeric().withMessage("driverProfit must be a positive number"),
    body("csn").isString().withMessage("csn must string"),
    body("distance").isString().withMessage("distance must string"),
    body("rating").isInt({max:5, min:0}).withMessage("rating must be a Integer between 0 and 5"),
  ]
}