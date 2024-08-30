const { ObjectId } = require("mongodb");
const userModel = require("../../models/user");
const vehiclePricingModel = require("../../models/vehiclePricing");
const rideModel = require("./../../models/ride");
const crypto = require("crypto");

const pipeline = [
  {
    $project: {
      _id: 1,
      vehicleType: 1,
      driverProfit: 1,
      minFare: 1,
      distanceForBasePrice: 1,
      basePrice: 1,
      pricePerUnitDistance: 1,
      pricePerUnitTime: 1,
      maxSpace: 1,
      vehicleImage: "$vehicle.vehicleImage",
    },
  },
];

const pipeline2 = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
  {
    $project: {
      _id: 1,
      source: 1,
      destination: 1,
      time: 1,
      distance: 1,
      serviceType: 1,
      paymentMethod: 1,
      rideTime: 1,
      price: 1,
      driverProfit: 1,
      stops: 1,
      userName: 1,
      userPhone: 1,
      rideId: 1,
      rideType: 1,
      userProfile: "$user.userProfile",
      status: 1,
      endPoints: 1,
      stopPoints: 1,
      sourceCity: 1,
    },
  },
];

exports.postVerifyUserwithPhone = async (req, res) => {
  try {
    let reqphone = req.body.phone;
    let user = await userModel.aggregate([
      { $match: { phone: reqphone } },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      { $unwind: "$country" },
      {
        $project: {
          _id: 1,
          userName: 1,
          userEmail: 1,
          customerId: 1,
          phone: 1,
          country: {
            _id: 1,
            countryShortName: 1,
            currency: 1,
          },
        },
      },
    ]);
    if (user.length == 0) {
      res.status(404).send({ success: false, message: "User Not Found" });
      return;
    }
    res.status(200).send({ success: false, user: user[0] });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Error From Server" });
  }
};

exports.postCalculatePricing = async (req, res) => {
  try {
    let time = req.body.time;
    let distance = req.body.distance;
    let zoneId = new ObjectId(req.body.zoneId);
    let prices = [];
    // get pricing of every city
    let pricings = await vehiclePricingModel.aggregate([
      {
        $match: {
          city: zoneId,
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleType",
          foreignField: "type",
          as: "vehicle",
        },
      },
      {
        $unwind: "$vehicle",
      },
      ...pipeline,
    ]);

    if (pricings.length == 0) {
      res.status(404).send({
        success: false,
        message: "selected city has no pricings",
      });
      return;
    }
    // Calculating Pricings
    pricings.forEach((type) => {
      let farePrice =
        type.basePrice +
        (distance - type.distanceForBasePrice) * type.pricePerUnitDistance +
        time * type.pricePerUnitTime;
      farePrice = Number(farePrice.toFixed(2));
      farePrice = type.minFare > farePrice ? type.minFare : farePrice;
      let driverProfit = Number(
        ((type.driverProfit / 100) * farePrice).toFixed(2)
      );
      let vehicleImage = type.vehicleImage;
      prices.push({
        driverProfit: driverProfit,
        vehicleType: type.vehicleType,
        price: farePrice,
        vehicleImage: vehicleImage,
      });
    });
    res.status(200).send({ success: true, prices: prices });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "Error From Server" });
  }
};

exports.postCreateRide = async (req, res) => {
  console.log(req.body);
  try {
    let uid = crypto.randomUUID();
    let ride = await rideModel.create({
      rideId: uid,
      userId: req.body.userId,
      source: req.body.source,
      destination: req.body.destination,
      time: req.body.time,
      distance: req.body.distance,
      serviceType: req.body.serviceType,
      paymentMethod: req.body.paymentmethod,
      rideTime: req.body.ridetime,
      price: req.body.price,
      driverProfit: req.body.driverProfit,
      stops: req.body.stops,
      userEmail: req.body.useremail,
      userName: req.body.username,
      userPhone: req.body.userphone,
      rideType: req.body.rideType,
      endPoints: req.body.endPoints,
      stopPoints: req.body.stopPoints,
      sourceCity: req.body.sourceCity,
    });
    let outputRide = await rideModel.aggregate([
      {
        $match: {
          _id: ride._id,
        },
      },
      ...pipeline2,
    ]);
    global.io.emit("newRide", outputRide[0]);
    res
      .status(200)
      .send({ status: "Success", message: "Ride Created Successfully" });
  } catch (err) {
    res.status(500).send({
      status: "Failure",
      message: "Error From Server",
    });
  }
};
