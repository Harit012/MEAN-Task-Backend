const { default: mongoose } = require("mongoose");
const userModel = require("../../models/user");
const jwt = require("../../controller/jwtOperations");
exports.postLoginUser = async (req, res) => {
  let data = req.body;
  if (data.email == "none" || data.password == "none") {
    res.send({ error: "Please enter email and password" });
  } else {
    const user = await userModel.findOne({
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

exports.getVarifyUser = (req, res) => {
  // let cookie = req.headers.cookie;
  
  const isUserAuthenticated = jwt.verify(req.headers.cookie);

  if(isUserAuthenticated){
    res.send({ varified:true });
  }
  else{
    res.send({ varified:false });
  }
};