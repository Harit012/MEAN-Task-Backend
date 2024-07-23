const { body, query } = require("express-validator");
exports.getUserValidationRules = () => {
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

exports.addUserValidationRules = () => {
  return [
    // userName Validation
    body("userName")
      .isLength({ min: 3 })
      .withMessage("userName must be at least 3 characters long"),
    // email Validation
    body("email").isEmail().withMessage(`Email is not Formatted correctly`),
    // country Validation
    body("country").isMongoId().withMessage("country must be a unique MongoId"),
    // phone Validation
    body("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("phone must be 10 characters long")
      .matches(/^[1-9]\d{9}$/)
      .withMessage("phone must be in digits and should not start with 0"),
  ];
};

exports.putUserValidationRules = () => {
  return [
    body("id").isMongoId().withMessage("id must be a unique MongoId"),
    // userName Validation
    body("userName")
      .isLength({ min: 3 })
      .withMessage("userName must be at least 3 characters long"),
    // email Validation
    body("email").isEmail().withMessage(`Email is not Formatted correctly`),
    // country Validation
    body("country").isMongoId().withMessage("country must be a unique MongoId"),
    // phone Validation
    body("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("phone must be 10 characters long")
      .matches(/^[1-9]\d{9}$/)
      .withMessage("phone must be in digits and should not start with 0"),
    // profile Validation
    body("olduserProfile")
      .isString()
      .withMessage("olduserProfile must be a string"),
  ];
};

exports.deleteUserValidationRules = () => {
  return [
    query("id").isMongoId().withMessage("id must be a unique MongoId"),

    query("customerId").matches(/^cus_[a-zA-Z0-9]{14}$/).withMessage("Customer Id is not Valid"),

  ];
};

// for cards 
exports.cardValidationRules = () => {
  return [
    body("cardId").matches(/^card_[a-zA-Z0-9]{24}$/).withMessage("CardId is not Valid"),
    body("customerId").matches(/^cus_[a-zA-Z0-9]{14}$/).withMessage("CustomerId is not Valid")
  ]
}



