exports.getDriversParamsCheck = (req, res, next) => {
  if (req.query.page && req.query.sort && req.query.input) {
    next();
  } else {
    res.status(400).send({
      success: false,
      message: "not all fields(page,sort,input) are Provided",
    });
  }
};

exports.postDriversParamsCheck = (req, res, next) => {
  if (
    req.body.driverName &&
    req.body.driverEmail &&
    req.body.phone &&
    req.body.country &&
    req.body.city &&
    req.file
  ) {
    next();
  } else {
    console.log(req.body);
    res
      .status(400)
      .send({ success: false, message: "Please enter all the fields" });
  }
};

exports.deleteDriverParamsCheck = (req, res, next) => {
  if (req.query.id && req.query.driver_stripe_id) {
    next();
  } else {
    res.status(400).send({ success: false, message: "Id is not Provided" });
  }
};

exports.patchDriverParamsCheck = (req, res, next) => {
  if (req.body.id && typeof req.body.approvel == "boolean") {
    next();
  } else {
    res
      .status(400)
      .send({ success: false, message: "Id or Approvel is not Provided" });
  }
};

exports.patchDriverServiceTypeParamsCheck = (req, res, next) => {
  if (req.body.id && req.body.serviceType) {
    next();
  } else {
    res.status(400).send({
      success: false,
      message: "Id or ServiceType is not Provided",
    });
  }
};

exports.putDriverParamsCheck = (req, res, next) => {
  if (
    req.body.id &&
    req.body.driverName &&
    req.body.driverEmail &&
    req.body.phone &&
    req.body.country &&
    req.body.city &&
    req.body.oldDriverProfile
  ) {
    next();
  } else {
    res
      .status(400)
      .send({ success: false, message: "Please enter all the fields" });
  }
};

exports.postAddBankAccountParamsCheck = (req, res, next) => {
  if (req.body.driverId && req.body.accountNumber && req.body.routingNumber) {
    next();
  } else {
    res
      .status(400)
      .send({ success: false, message: "Please enter all the fields" });
  }
};
// Running Request

exports.patchStatusChange = (req, res, next) => {
  if (req.body.rideId && req.body.status) {
    next();
  } else {
    res
      .status(400)
      .send({ success: false, message: "rideId or status is not Provided" });
  }
};

exports.patchDriverResponseParamsCheck = (req, res, next) => {
  if (typeof req.body.response == "number" && req.body.rideId) {
    next();
  } else {
    res.status(400).send({ success: false, message: "rideId is not Provided" });
  }
};
exports.patchCompleteRideParamsCheck = (req, res, next) => {
  if (req.body.rideId) {
    next();
  } else {
    res.status(400).send({ success: false, message: "rideId is not Provided" });
  }
};

exports.postPaymentProcessParamsCheck = (req, res, next) => {
  let obj = req.body;
  if (
    obj.id &&
    obj.driver_stripe_id &&
    obj.customerId &&
    obj.destination &&
    obj.source &&
    obj.rideTime &&
    obj.userName &&
    obj.time &&
    obj.paymentMethod &&
    obj.serviceType &&
    obj.price &&
    obj.driverName &&
    obj.driverProfit &&
    obj.csn &&
    obj.distance &&
    obj.rating
  ) {
    next();
  } else {
    res.status(400).send({
      success: false,
      message: "feilds are missing",
      requiredFields: [
        "id",
        "driver_stripe_id",
        "customerId",
        "destination",
        "source",
        "rideTime",
        "userName",
        "time",
        "paymentMethod",
        "serviceType",
        "price",
        "driverName",
        "driverProfit",
        "csn",
        "distance",
        "rating"
      ],
    });
  }
};
