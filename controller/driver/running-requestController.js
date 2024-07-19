const rideModel = require("../../models/ride");

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
    },
  },
];

exports.getRunningRequest = async (req, res) => {
  try {
    let acceptedRides = await rideModel.aggregate([
      {
        $match: {
          $and: [
            { driverId: { $exists: true } },
            {
              $and: [
                { status: { $ne: "completed" } },
                { status: { $ne: "available" } },
              ],
            },
          ],
        },
      },
      ...pipeline
    ]);
    let newRides = await rideModel.aggregate([
      {
        $match: {
          $and: [
            { driverId: { $exists: true } },
            { status: { $eq: "available" } },
          ],
        },
      },
      ...pipeline,
      {
        $project:{
          driverName:0
        }
      }
    ]);
    res.status(200).send({ status: "Success", acceptedRides: acceptedRides , newRides : newRides});
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Failure",
      message: "can not get running request from server",
    });
  }
};

exports.patchAcceptRide = async (req, res) => {
  try {
    let ride = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { status: "accepted" },
      { new: true }
    );

    let rideTOsend = await rideModel.aggregate([
      { $match: { _id: ride._id } },
      ...pipeline,
    ]);
    res.status(200).send({ status: "Success", ride: rideTOsend[0] });
    // socket
    let io = req.app.get("socketio");
    io.emit("acceptRideFromServer", rideTOsend[0]);
  } catch (err) {
    res
      .status(500)
      .send({ status: "Failure", message: "can not accept ride from server" });
  }
};

exports.patchStatusChange = async (req, res, next) => {
  try {
    let UpdatedRide = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { status: req.body.status },
      { new: true }
    );
    let ride = await rideModel.aggregate([
      { $match: { _id: UpdatedRide._id } },
      ...pipeline,
    ]);
    console.log(ride);
    res.status(200).send({ status: "Success", ride: ride[0] });
    // socket
    let io = req.app.get("socketio");
    io.emit("changeStatusFromServer", ride[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "Failure",
      message: "can not change status from server",
    });
  }
};
