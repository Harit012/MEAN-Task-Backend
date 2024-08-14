exports.postVerifyUserParamsCheck = (req, res, next) => {
  if (req.body.phone) {
    next();
  } else {
    res
      .status(400)
      .send({ success: false, message: "Phone is not Provided" });
  }
};

exports.calculatePricingsParamsCheck = (req, res, next) => {
  if (req.body.time && req.body.distance && req.body.zoneId) {
    next();
  } else {
    res.status(400).send({
      success: false,
      message: "(time, distance, zoneId) are not Provided",
    });
  }
};

exports.postCreateRideParamsCheck = (req, res, next) => {
  if (
    req.body.userId &&
    req.body.destination &&
    req.body.distance &&
    req.body.paymentmethod &&
    req.body.price &&
    req.body.driverProfit &&
    req.body.ridetime &&
    req.body.serviceType &&
    req.body.source &&
    req.body.stops &&
    req.body.time &&
    req.body.useremail &&
    req.body.username &&
    req.body.userphone &&
    req.body.endPoints &&
    req.body.stopPoints &&
    req.body.sourceCity
  ) {
    next();
  } else {
    res.status(400).send({
      success: false,
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
      success: false,
      message: "rideId is not Provided",
    })
  }
};
// assign Driver 

exports.getAllDriversParamsCheck = (req,res,next)=>{
  if(req.query.cityId && req.query.serviceType && req.query.rideId){
    next();
  }else{
    res.status(400).send({
      success: false,
      message: "cityId or serviceType is not Provided",
    })
  }
}

exports.patchAsssignDriverParamsCheck = (req,res,next)=>{
  if(req.body.rideId && req.body.driverId){
    next();
  }else{
    res.status(400).send({
      success: false,
      message: "rideId or driverId is not Provided",
    })
  }
}