let express = require("express");
let userAuth = require("../controller/authentication/userAuth");
let router = express.Router();
let middlewares = require("../middlewares/login");

router.post("/login", middlewares.loginParamsCheck , userAuth.postLoginUser);

module.exports = router;
