const { body, validationResult } = require("express-validator");
const userLoginValidationRules = () => {
  return [
    // email validation
    body("email")
      .isEmail()
      .withMessage(`Email is not Formatted correctly`),
    // password Validation
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("password")
      .isLength({ max: 16 })
      .withMessage("Password must Not be more than 16 characters"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  let allErrorMessages = [];
  errors.array().forEach((err) => {
    allErrorMessages.push(err.msg);
  });
  let message = `Invalid value in field :- ${allErrorMessages.join(" & ")}`;
  return res.status(422).send({
    success: false,
    message: message,
  });
};

module.exports = {
  userLoginValidationRules,
  validate,
};
