let express = require("express");
let userAuth = require("../controller/authentication/userAuth");
let router = express.Router();

router.post("/login", userAuth.postLoginUser);

module.exports = router;
