exports.getDriversParamsCheck = (req, res, next) => {
  if (req.query.page && req.query.sort && req.query.input) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
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
      .send({ status: "Failure", message: "Please enter all the fields" });
  }
};

exports.deleteDriverParamsCheck = (req, res, next) => {
  if (req.query.id) {
    next();
  } else {
    res.status(400).send({ status: "Failure", message: "Id is not Provided" });
  }
};

exports.patchDriverParamsCheck = (req, res, next) => {
  if (req.body.id && typeof(req.body.approvel) == "boolean") {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "Id or Approvel is not Provided" });
  }
};

exports.patchDriverServiceTypeParamsCheck = (req, res, next) => {
  if (req.body.id && req.body.serviceType) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
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
    req.body.driverProfile
  ) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "Please enter all the fields" });
  }
};

// Running Request 

exports.patchAcceptRideParamsCheck = (req, res, next) => {
  if(req.body.rideId){
    next();
  }else{
    res.status(400).send({status:"Failure",message:"rideId is not Provided"});
  }
}

exports.patchStatusChange = (req, res, next) => {
  if(req.body.rideId && req.body.status){
    next();
  }else{
    res.status(400).send({status:"Failure",message:"rideId or status is not Provided"});
  }
}