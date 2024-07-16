exports.postVerifyUserParamsCheck = (req, res, next) => {
  if (req.body.phone) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "Phone is not Provided" });
  }
};

exports.getPricingsForCityParamsCheck = (req, res, next) => {
  if (req.query.city) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "City is not Provided" });
  }
};

exports.calculatePricingsParamsCheck = (req, res, next) => {
  if (req.body.time && req.body.distance && req.body.zoneId) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "(time, distance, zoneId) are not Provided",
    });
  }
};

exports.postCreateRideParamsCheck = (req, res, next) => {
  if (
    req.body.destination &&
    req.body.distance &&
    req.body.paymentmethod &&
    req.body.price &&
    req.body.ridetime &&
    req.body.serviceType &&
    req.body.source &&
    req.body.stops &&
    req.body.time &&
    req.body.useremail &&
    req.body.username &&
    req.body.userphone
  ) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "Not all fields are provided",
    });
  }
};

// Confirmed ride
exports.patchCancleRideParamsCheck = (req, res, next) => {
  if (req.body.rideId) {
    next();
  } else {
    res.status(400).send({
      status : "Failure",
      message: "rideId is not Provided",
    })
  }
};
// assign Driver 
exports.patchAsssignDriverParamsCheck = (req,res,next)=>{
  if(req.body.rideId && req.body.driverId){
    next();
  }else{
    res.status(400).send({
      status : "Failure",
      message: "rideId or driverId is not Provided",
    })
  }
}