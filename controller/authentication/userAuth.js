const adminModel = require("../../models/admin");
const jwt = require("../../controller/jwtOperations");

exports.postLoginUser = async (req, res) => {
  try{
    const user = await adminModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user) {
      res.status(404).send({ success: false, message: "User not found" });
      return;
    } else {
      const token = jwt.createToken({ email: req.body.email });
      res.status(200).send({ success:true, token: token });
      return;
    }
  }catch(err){
    res.status(500).send({ success: false, message: "Error While Performing Login" });
  }
};

exports.getVerifiedUser = (req, res, next) => {
    let token = req.headers.authorization;
    const decoded = jwt.varifyToken(token);
    if (decoded) {
      next();
    } else {
      res.status(401).send({
        statusCode:401,
        success: false,
        message: "User does not have valid token",
      });
    }
};
