var express = require("express");
var userAuth = require("../controller/authentication/userAuth");
var router = express.Router();

router.post("/login", userAuth.postLoginUser);

router.use("/", userAuth.getVerifiedUser)

module.exports = router;
