const rideModel = require("../../models/ride");
const driverModel = require("../../models/driver");
const { ObjectId } = require("mongodb");
const settingsModel = require("../../models/settings");

const pipeline = [
  {
    $facet: {
      withDriverId: [
        {
          $match: { driverId: { $exists: true } },
        },
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
          $addFields: {
            statusOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$status", "available"] }, then: 1 },
                  { case: { $eq: ["$status", "accepted"] }, then: 2 },
                  { case: { $eq: ["$status", "arrived"] }, then: 3 },
                  { case: { $eq: ["$status", "picked"] }, then: 4 },
                  { case: { $eq: ["$status", "started"] }, then: 5 },
                  { case: { $eq: ["$status", "completed"] }, then: 6 },
                ],
                default: 7,
              },
            },
          },
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
            driverName: "$driver.driverName",
            sourceCity: 1,
          },
        },
        {
          $sort: { statusOrder: 1 },
        },
      ],
      withoutDriverId: [
        {
          $match: { driverId: { $exists: false } },
        },
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
                  { case: { $eq: ["$status", "completed"] }, then: 6 },
                ],
                default: 7,
              },
            },
          },
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
            driverName: null,
            sourceCity: 1,
          },
        },
        {
          $sort: { statusOrder: 1 },
        },
      ],
    },
  },
  {
    $project: {
      combined: { $concatArrays: ["$withoutDriverId", "$withDriverId"] },
    },
  },
  {
    $unwind: "$combined",
  },
  {
    $replaceRoot: { newRoot: "$combined" },
  },
];
const pipeline2 = [
  
  {
    $facet: {
      withDriverId: [
        {
          $match: { driverId: { $exists: true } },
        },
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
            sourceCity: 1,
          },
        },
      ],
      withoutDriverId: [
        {
          $match: { driverId: { $exists: false } },
        },
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
            driverName: null,
            sourceCity: 1,
          },
        },
      ],
    },
  },
  {
    $project: {
      combined: { $concatArrays: ["$withoutDriverId", "$withDriverId"] },
    },
  },
  {
    $unwind: "$combined",
  },
  {
    $replaceRoot: { newRoot: "$combined" },
  },
];

exports.getAllDrivers = async (req, res) => {
  let sourceCity = req.query.cityId;
  let serviceType = req.query.serviceType;
  let rideId = req.query.rideId;
  try {
    let blocked = await rideModel.aggregate([
      {
        $match:{
          _id:new ObjectId(rideId)
        }
      },
      {
        $project:{
          _id:0,
          blockList:1,
        }
      }
    ]);
    // creating List of Ids
    let blockList = [];
    blocked.forEach((element) => {
      blockList.push(...element.blockList);
    })
    // console.log(blockList)
    // finding Drivers
    let drivers = await driverModel.aggregate([
      {
        $match: {
          $and: [
            { city: new ObjectId(sourceCity) },
            { serviceType: serviceType },
            { isAvailable: true },
            { approved: true },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          driverName: 1,
          phone: 1,
          serviceType: 1,
          isAvailable: 1,
          approved: 1,
          country: 1,
          driverProfile: 1,
          driverEmail: 1,
        },
      },
    ]);
    // removing blocked drivers
    drivers = drivers.filter((driver) => !blockList.includes(driver._id.toString()));
    res.status(200).send({
      success: true,
      driversList: drivers,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not get drivers from server",
    });
  }
};

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
    // setTimeout(() => {
    res.status(200).send({ success: true, rides: rides });
    // }, 2000);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not get confirmed rides from server",
    });
  }
};

exports.patchCancleRide = async (req, res) => {
  try {
    let rideId = req.body.rideId;
    await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: "cancelled" },
      { new: true }
    );
    let updatedRide = await rideModel.aggregate([
      {
        $match:{
          _id:new ObjectId(rideId),
        }
      },
      ...pipeline2
    ]);
    // console.log(updatedRide)
    res.status(200).send({ success: true, message: "ride cancelled" });
    let io = req.app.get("socketio");
    io.emit("cancelRide", updatedRide[0]);
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not cancel ride from server" });
  }
};

exports.patchAssingDriver = async (req, res) => {
  try {
    let updatedRide = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { driverId: req.body.driverId },
      { new: true }
    );

    let ride = await rideModel.aggregate([
      { $match: { _id: updatedRide._id } },
      ...pipeline,
    ]);
    let io = req.app.get("socketio");
    io.emit("assignRideFromServer", ride[0]);
    res.status(200).send({ success: true, ride: ride[0] });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not assign driver from server",
    });
  }
};

exports.getTimeOut = async (req, res) => {
  try {
    let settings = await settingsModel.aggregate([
      { $match: { _id: new ObjectId("665e91b8e54b312a06e372b6") } },
      { $project: { timeOut: 1 } },
    ]);
    settings = settings[0].timeOut;
    res.status(200).send({ success: true, timeOut: settings });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not get TimeOut from server" });
  }
};

