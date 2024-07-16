const { Socket } = require("socket.io");
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
    $addFields: {
      statusOrder: {
        $switch: {
          branches: [
            { case: { $eq: ["$status", "available"] }, then: 1 },
            { case: { $eq: ["$status", "accepted"] }, then: 2 },
            { case: { $eq: ["$status", "arrived"] }, then: 3 },
            { case: { $eq: ["$status", "picked"] }, then: 4 },
            { case: { $eq: ["$status", "started"] }, then: 5 },
            { case: { $eq: ["$status", "completed"] }, then: 6 }
          ],
          default: 7 
        }
      }
    }
  },
  {
    $sort: { statusOrder: 1 }
  },
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
      stops: 1,
      userName: 1,
      userPhone: 1,
      rideId: 1,
      rideType: 1,
      userProfile: "$user.userProfile",
      status: 1,
      endPoints: 1,
      stopPoints: 1,
    },
  },
];

exports.getConfirmedRides = async (req, res) => {
  try {
    let rides = await rideModel.aggregate([
      {
        $match: {
          $nor: [{ status: "cancelled" }],
        },
      },
      ...pipeline,
    ]);
    res.status(200).send({ status: "Success", rides: rides });
  } catch (err) {
    res.status(500).send({
      status: "Failure",
      message: "can not get confirmed rides from server",
    });
  }
};

exports.patchCancleRide = async (req, res) => {
  try {
    let rideId = req.body.rideId;
    let ride = await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: "cancelled" },
      { new: true }
    );
    res.status(200).send({ status: "Success", message: "ride cancelled" });
    let io = req.app.get("socketio");
    io.emit("cancelRide", ride._id);
  } catch (err) {
    res
      .status(500)
      .send({ status: "Failure", message: "can not cancel ride from server" });
  }
};

exports.patchAssingDriver = async (req,res) => {
  try {
    let ride = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { driverId: req.body.driverId },
      { new: true }
    );
    let io = req.app.get("socketio");
    io.emit("assignRideFromServer", ride);
    res.status(200).send({status:"Success",ride:ride});

  } catch (err) {
    res
      .status(500)
      .send({
        status: "Failure",
        message: "can not assign driver from server",
      });
  }
};
