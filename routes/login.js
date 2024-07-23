let express = require("express");
let userAuth = require("../controller/authentication/userAuth");
let router = express.Router();
let middlewares = require("../middlewares/Params check/login");
let {validate, userLoginValidationRules} = require("../middlewares/Field validators/login")

router.get("/test", (req, res) => {
  console.log(`FrontEnd Connected`);
  res.status(200).send({
    message: "connection SuccessFull",
    success:true
  })
});

router.post("/login", middlewares.loginParamsCheck,userLoginValidationRules(),validate, userAuth.postLoginUser);

module.exports = router;
