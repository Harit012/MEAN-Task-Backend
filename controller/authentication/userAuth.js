// const { default: mongoose } = require("mongoose");
const adminModel = require("../../models/admin");
const jwt = require("../../controller/jwtOperations");


exports.postLoginUser = async (req, res) => {
  let data = req.body;
  if (data.email == "none" || data.password == "none") {
    res.send({ error: "Please enter email and password" });
  } else {
    const user = await adminModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user) {
      res.send({ error: "User not found" });
    } else {
      const token = jwt.createToken({ email: req.body.email });
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.send({ token: token });
    }
  }
};

exports.getVerifiedUser = (req, res, next) => {
  if (req.headers.authorization) {
    var token = req.headers.authorization;
    const decoded = jwt.varifyToken(token);
    if (decoded) {
      next();
    } else {
      res.send({ varified: false });
    }
  } else {
    res.send({ varified: false });
  }
};
