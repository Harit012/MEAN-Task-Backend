let express = require("express");
let userAuth = require("../controller/authentication/userAuth");
let router = express.Router();
let middlewares = require("../middlewares/login");

router.get("/test", (req, res) => {
  console.log(`FrontEnd Connected`);
  res.status(200).send({
    message: "connection SuccessFull",
    success:true
  })
});

router.post("/login", middlewares.loginParamsCheck, userAuth.postLoginUser);

module.exports = router;
