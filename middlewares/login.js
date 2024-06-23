exports.loginParamsCheck = (req, res, next) => {
  let data = req.body;
  if (data.email && data.password) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "Email or Password not Provided",
    });
  }
};

exports.verificationParamsCheck = (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send({
      status: "Failure",
      message: "User has not valid token",
    });
  }
};
