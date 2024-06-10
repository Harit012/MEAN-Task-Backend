const jwt = require("jsonwebtoken");

exports.createToken = (data) => {
  return jwt.sign(data, process.env.SECRET,{expiresIn:process.env.EXPIRE_TOKEN});
};
exports.varifyToken = (token) => {
  const authToken  = token.slice(7,token.length)
  try {
    let result = jwt.verify(authToken, process.env.SECRET);
    const {exp} = jwt.decode(authToken); 

    if(exp< new Date().getTime() / 1000) {
      return false
    }else{
      return true;
    }
  } catch (err) {
    return false;
  }
};
