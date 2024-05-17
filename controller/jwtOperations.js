const jwt = require("jsonwebtoken");

exports.createToken = (data) => {
  return jwt.sign(data, process.env.secret);
};
exports.varifyToken = (token) => {
  token = token.slice(6, token.length);
  try {
    result = jwt.verify(token, process.env.secret);
    return true;
  } catch (err) {
    return false;
  }
};
