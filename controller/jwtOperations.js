const jwt = require("jsonwebtoken");

exports.createToken = (data) => {
  return jwt.sign(data, process.env.secret);
};
exports.varifyToken = (token) => {
  try {
    let result = jwt.verify(token, process.env.SECRET);
    return true;
  } catch (err) {
    return false;
  }
};
