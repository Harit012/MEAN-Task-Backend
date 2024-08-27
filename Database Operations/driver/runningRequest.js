const driverModel = require("../../models/driver");
const rideModel = require("../../models/ride");

const { ObjectId } = require("mongodb");
const pipeline = [
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
    $lookup: {
      from: "drivers",
      localField: "driverId",
      foreignField: "_id",
      as: "driver",
    },
  },
  { $unwind: "$driver" },
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
      driverName: "$driver.driverName",
      driverId: "$driver._id",
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
    $lookup: {
      from: "countries",
      localField: "user.country",
      foreignField: "_id",
      as: "country",
    },
  },
  {
    $unwind: "$country",
  },
  {
    $lookup: {
      from: "drivers",
      localField: "driverId",
      foreignField: "_id",
      as: "driver",
    },
  },
  { $unwind: "$driver" },
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
      driverName: "$driver.driverName",
      driverId: "$driver._id",
      customerId: "$user.customerId",
      csn: "$country.currencyISOName",
      userEmail: "$user.userEmail",
      callCode: "$country.countryCallCode",
      driver_stripe_id: "$driver.driver_stripe_id",
    },
  },
];
function throwError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
exports.acceptRideByDriver = async (rideId) => {
  try {
    let ride = await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: "accepted", $unset: { timeOfAssign: 1, AcceptanceStatus: 1 } },
      { new: true }
    );
    await driverModel.findOneAndUpdate(
      {_id: ride.driverId},
      {inRide: true}
    );
  } catch (err) {
    console.log(err);
    throw throwError(500, "mongoose Error while accepting Ride");
  }
};

exports.rideToSend = async (rideId) => {
  try {
    let ride = await rideModel.aggregate([
      { $match: { _id: new ObjectId(rideId) } },
      ...pipeline2,
    ]);
    return ride[0];
  } catch (err) {
    throw throwError(500, "mongoose Error while getting Ride to send");
  }
};

exports.statusChange = async (rideId, status) => {
  try {
    let ride = await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: status },
      { new: true }
    );
    await driverModel.findOneAndUpdate({_id:ride.driverId},{$set :{inRide: false}},{ new: true });
  } catch (err) {
    throw throwError(500, "mongoose Error while updating Status");
  }
};
