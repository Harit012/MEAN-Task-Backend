// Vehicle Type

exports.postVehicleTypeParamsCheck = (req, res, next) => {
  if (req.file && req.body.type) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "Please enter all the fields" });
  }
};

exports.putVehicleTypeParamsCheck = (req, res, next) => {
  if (req.body.id && req.body.type && req.body.prvImg) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "Not all the fields are provided" });
  }
};

exports.deleteVehicleTypeParamsCheck = (req, res, next) => {
  if (req.query.id) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "Id is not Provided",
    });
  }
};

exports.getTypesForPricingParamsCheck = (req, res, next) => {
  if (req.query.city) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "City Id Not Provided" });
  }
};

// Country

exports.postCountryParamsCheck = (req, res, next) => {
  if (
    req.body.countryName &&
    req.body.currency &&
    req.body.countryCallCode &&
    req.body.FlagUrl &&
    req.body.timezones &&
    req.body.countryShortName
  ) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "Please enter all the fields",
    });
  }
};

// vehicle Pricing

exports.postVehiclePricingParamsCheck = (req, res, next) => {
  if (
    req.body.country &&
    req.body.city &&
    req.body.vehicleType &&
    req.body.driverProfit &&
    req.body.minFare &&
    req.body.distanceForBasePrice &&
    req.body.basePrice &&
    req.body.pricePerUnitDistance &&
    req.body.pricePerUnitTime &&
    req.body.maxSpace &&
    req.body.ccv
  ) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "Please enter all the fields",
    });
  }
};

exports.patchVehiclePricingParamsCheck = (req, res, next) => {
  if (
    req.body._id &&
    req.body.driverProfit &&
    req.body.minFare &&
    req.body.distanceForBasePrice &&
    req.body.basePrice &&
    req.body.pricePerUnitDistance &&
    req.body.pricePerUnitTime &&
    req.body.maxSpace &&
    req.body.ccv
  ) {
    next();
  } else {
    res.status(400).send({
      status: "Failure",
      message: "Please enter all the fields",
    });
  }
};

// City/Zone

exports.getZonesParamsCheck = (req, res, next) => {
  if (req.query.countryId) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Failure", message: "CountryId is not Provided." });
  }
};

exports.postZoneParamsCheck = (req,res,next)=>{
    if (req.body.country && req.body.boundry && req.body.zoneName) {
        next();
    }
    else{
        res
      .status(400)
      .send({ status: "Failure", message: "All the Fields are not Provided" });
    }

}

exports.patchZoneParamsCheck = (req,res,next)=>{
    if (req.body.id && req.body.boundry ) {
        next();
    }else{
        res
      .status(400)
      .send({
        status: "Failure",
        message: "Provided Fields are not correct !!",
      });
    }
}