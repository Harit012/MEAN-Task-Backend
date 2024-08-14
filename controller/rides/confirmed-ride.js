const rideModel = require("../../models/ride");
const driverModel = require("../../models/driver");
const { ObjectId } = require("mongodb");
const settingsModel = require("../../models/settings");
const query = require("./../../Database Operations/rides/confirmRides");

// const pipeline = [
//   {
//     $facet: {
//       withDriverId: [
//         {
//           $match: { driverId: { $exists: true } },
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: "$user" },
//         {
//           $lookup: {
//             from: "drivers",
//             localField: "driverId",
//             foreignField: "_id",
//             as: "driver",
//           },
//         },
//         { $unwind: "$driver" },
//         {
//           $addFields: {
//             statusOrder: {
//               $switch: {
//                 branches: [
//                   { case: { $eq: ["$status", "available"] }, then: 1 },
//                   { case: { $eq: ["$status", "assigned"] }, then: 2 },
//                   { case: { $eq: ["$status", "accepted"] }, then: 3 },
//                   { case: { $eq: ["$status", "arrived"] }, then: 4 },
//                   { case: { $eq: ["$status", "picked"] }, then: 5 },
//                   { case: { $eq: ["$status", "started"] }, then: 6 },
//                   { case: { $eq: ["$status", "completed"] }, then: 7 },
//                 ],
//                 default: 8,
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             source: 1,
//             destination: 1,
//             time: 1,
//             distance: 1,
//             serviceType: 1,
//             paymentMethod: 1,
//             rideTime: 1,
//             price: 1,
//             stops: 1,
//             userName: 1,
//             userPhone: 1,
//             rideId: 1,
//             rideType: 1,
//             userProfile: "$user.userProfile",
//             status: 1,
//             endPoints: 1,
//             stopPoints: 1,
//             driverName: "$driver.driverName",
//             sourceCity: 1,
//           },
//         },
//         {
//           $sort: { statusOrder: 1 },
//         },
//       ],
//       withoutDriverId: [
//         {
//           $match: { driverId: { $exists: false } },
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: "$user" },
//         {
//           $addFields: {
//             statusOrder: {
//               $switch: {
//                 branches: [
//                   { case: { $eq: ["$status", "available"] }, then: 1 },
//                   { case: { $eq: ["$status", "accepted"] }, then: 2 },
//                   { case: { $eq: ["$status", "arrived"] }, then: 3 },
//                   { case: { $eq: ["$status", "picked"] }, then: 4 },
//                   { case: { $eq: ["$status", "started"] }, then: 5 },
//                   { case: { $eq: ["$status", "completed"] }, then: 6 },
//                 ],
//                 default: 7,
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             source: 1,
//             destination: 1,
//             time: 1,
//             distance: 1,
//             serviceType: 1,
//             paymentMethod: 1,
//             rideTime: 1,
//             price: 1,
//             stops: 1,
//             userName: 1,
//             userPhone: 1,
//             rideId: 1,
//             rideType: 1,
//             userProfile: "$user.userProfile",
//             status: 1,
//             endPoints: 1,
//             stopPoints: 1,
//             driverName: null,
//             sourceCity: 1,
//           },
//         },
//         {
//           $sort: { statusOrder: 1 },
//         },
//       ],
//     },
//   },
//   {
//     $project: {
//       combined: { $concatArrays: ["$withoutDriverId", "$withDriverId"] },
//     },
//   },
//   {
//     $unwind: "$combined",
//   },
//   {
//     $replaceRoot: { newRoot: "$combined" },
//   },
// ];
// const pipeline2 = [
//   {
//     $facet: {
//       withDriverId: [
//         {
//           $match: { driverId: { $exists: true } },
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: "$user" },
//         {
//           $lookup: {
//             from: "drivers",
//             localField: "driverId",
//             foreignField: "_id",
//             as: "driver",
//           },
//         },
//         { $unwind: "$driver" },
//         {
//           $project: {
//             _id: 1,
//             source: 1,
//             destination: 1,
//             time: 1,
//             distance: 1,
//             serviceType: 1,
//             paymentMethod: 1,
//             rideTime: 1,
//             price: 1,
//             stops: 1,
//             userName: 1,
//             userPhone: 1,
//             rideId: 1,
//             rideType: 1,
//             userProfile: "$user.userProfile",
//             status: 1,
//             endPoints: 1,
//             stopPoints: 1,
//             driverName: "$driver.driverName",
//             sourceCity: 1,
//           },
//         },
//       ],
//       withoutDriverId: [
//         {
//           $match: { driverId: { $exists: false } },
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: "$user" },
//         {
//           $project: {
//             _id: 1,
//             source: 1,
//             destination: 1,
//             time: 1,
//             distance: 1,
//             serviceType: 1,
//             paymentMethod: 1,
//             rideTime: 1,
//             price: 1,
//             stops: 1,
//             userName: 1,
//             userPhone: 1,
//             rideId: 1,
//             rideType: 1,
//             userProfile: "$user.userProfile",
//             status: 1,
//             endPoints: 1,
//             stopPoints: 1,
//             driverName: null,
//             sourceCity: 1,
//           },
//         },
//       ],
//     },
//   },
//   {
//     $project: {
//       combined: { $concatArrays: ["$withoutDriverId", "$withDriverId"] },
//     },
//   },
//   {
//     $unwind: "$combined",
//   },
//   {
//     $replaceRoot: { newRoot: "$combined" },
//   },
// ];

exports.getAllDrivers = async (req, res) => {
  let sourceCity = req.query.cityId;
  let serviceType = req.query.serviceType;
  let rideId = req.query.rideId;
  try {
    let blocked = await query.fetchBlockedDrivers(rideId);
    let drivers = await query.fetchAvailableDrivers(
      serviceType,
      sourceCity,
      blocked
    );

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
    let rides = await query.getConfirmedRides();
    res.status(200).send({ success: true, rides: rides });
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

    await query.patchCancleRide(rideId);

    let updatedRide = await query.getRideInFormatedMannenr(rideId);

    res.status(200).send({ success: true, message: "ride cancelled" });
    global.io.emit("cancelRide", updatedRide);
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not cancel ride from server" });
  }
};

exports.patchAssingDriverManually = async (req, res) => {
  try {
    await rideModel.findOneAndUpdate({_id:req.body.rideId},{status:"assignedToOne"});
    await query.assignRideToDriver(
      req.body.rideId,
      req.body.driverId
    );

    let ride = await query.getRideInFormatedMannenr(req.body.rideId);
    global.io.emit("assignRideFromServer", ride);
    res.status(200).send({ success: true, ride: ride });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.patchAssignToAnyDriver = async (req, res) => {
  try {
    let updatedRide = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { status: "assignedToAny" },
      { new: true }
    );

    res.status(200).send({ success: true, ride: updatedRide });
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
