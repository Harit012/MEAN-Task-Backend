const rideModel = require("../../models/ride");
const driverModel = require("../../models/driver");

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
      sourceCity: 1,
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
      ...pipeline,
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
        $project: {
          driverName: 0,
        },
      },
    ]);
    res.status(200).send({
      success: true,
      acceptedRides: acceptedRides,
      newRides: newRides,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
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
    await driverModel.findOneAndUpdate(
      { _id: ride.driverId },
      { $set: { isAvailable: false } }
    );
    res.status(200).send({ success: true, ride: rideTOsend[0] });
    // socket
    let io = req.app.get("socketio");
    io.emit("acceptRideFromServer", rideTOsend[0]);
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not accept ride from server" });
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
    if(req.body.status == 'completed'){
      await driverModel.findOneAndUpdate(
        { _id: ride[0].driverId },
        {$set: {isAvailable: true}}
      );
    }
    res.status(200).send({ success: true, ride: ride[0] });
    let io = req.app.get("socketio");
    // socket
    io.emit("changeStatusFromServer", ride[0]);
    if(ride[0].status == 'completed'){
      io.emit("CompletedRide",ride[0]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "can not change status from server",
    });
  }
};

exports.patchDeleteDriver = async (req, res) => {
  try {
    let updatedRide = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { $unset: { driverId: 1 } }
    );
    res.status(200).send({ success: true, message: updatedRide });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "can not delete driver from server" });
  }
};


exports.patchBlockDriver = async (req, res) => {
  try {
    await rideModel.findOneAndUpdate(
      { _id:  req.body.rideId},
      { $addToSet: { blockList: req.body.driverId} } 
    )
    res.status(200).send({success: true, message: "List Updated"});
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not block driver from server" });
  }
};

