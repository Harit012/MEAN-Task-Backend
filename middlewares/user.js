exports.getUsersParamsCheck = (req, res, next) => {
  if (req.query.page && req.query.sort && req.query.input) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "not all fields(page,sort,input) are Provided",
    });
  }
};

exports.postUsersParamsCheck = (req, res, next) => {
  if (
    req.body.userName &&
    req.body.email &&
    req.body.country &&
    req.body.phone &&
    req.file.path
  ) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "Not all fields are provided." });
  }
};

exports.deleteUserParamsCheck = (req, res, next) => {
  if (req.query.id && req.query.customerId) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "Id or customerId are not Provided",
    });
  }
};

exports.putUserParamsCheck = (req, res, next) => {
  if (
    req.body.userName &&
    req.body.email &&
    req.body.country &&
    req.body.phone &&
    req.body.olduserProfile
  ) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "Not all fields are provided." });
  }
};

// cards

exports.postCardParamsCheck = (req, res, next) => {
  if (req.body.customerId && req.body.token) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "cardId or token is not Provided",
    });
  }
};

exports.deleteCardParamsCheck = (req, res, next) => {
  if (req.query.cardId && req.query.customerId) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "cardId or customerId are not Provided",
    });
  }
}

exports.defaultCardParamsCheck = (req, res, next) => {
  if (req.body.cardId && req.body.customerId) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "cardId or customerId are not Provided",
    });
  }
}