const adminModel = require("../../models/admin");
const jwt = require("../../controller/jwtOperations");

exports.postLoginUser = async (req, res) => {
    const user = await adminModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user) {
      res.status(404).send({ status: "Failure", message: "User not found" });
    } else {
      const token = jwt.createToken({ email: req.body.email });
      // // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
      // // res.setHeader("Access-Control-Allow-Credentials", "true");
      res.status(200).send({ status: "Success", token: token });
    }
};

exports.getVerifiedUser = (req, res, next) => {
    let token = req.headers.authorization;
    const decoded = jwt.varifyToken(token);
    if (decoded) {
      next();
    } else {
      res.status(401).send({
        status: "Failure",
        message: "User has not valid token",
      });
    }
};
