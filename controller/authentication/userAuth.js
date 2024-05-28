const { default: mongoose } = require("mongoose");
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
      res.setHeader("sameSite", "none");
      res.cookie("token", token);
      res.send({ token: token });
    }
  }
};

exports.getVerifiedUser = (req, res, next) => {
  if (req.headers.cookie) {
    var token = req.headers.cookie;
    const decoded = varifyToken(token);
    if (decoded) {
      next();
    } else {
      console.log("not varified");
      res.send({ varified: false });
    }
  } else {
    console.log("not varified");
    res.send({ varified: false });
  }
};

// exports.getVarifyUser = (req, res) => {
//   // let cookie = req.headers.cookie;
  
//   const isUserAuthenticated = jwt.verify(req.headers.cookie);

//   if(isUserAuthenticated){
//     res.send({ varified:true });
//   }
//   else{
//     res.send({ varified:false });
//   }
// };