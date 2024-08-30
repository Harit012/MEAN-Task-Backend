const rideModel = require("../../models/ride");
const driverModel = require("../../models/driver");
const { ObjectId } = require("mongodb");

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
                  { case: { $eq: ["$status", "assignedToAny"] }, then: 2 },
                  { case: { $eq: ["$status", "assignedToOne"] }, then: 2 },
                  { case: { $eq: ["$status", "accepted"] }, then: 3 },
                  { case: { $eq: ["$status", "arrived"] }, then: 4 },
                  { case: { $eq: ["$status", "picked"] }, then: 5 },
                  { case: { $eq: ["$status", "started"] }, then: 6 },
                  { case: { $eq: ["$status", "completed"] }, then: 7 },
                ],
                default: 8,
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

function throwError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Fetch blocked driver IDs for a specific ride
exports.fetchBlockedDrivers = async (rideId) => {
  try {
    const blockedRides = await rideModel.aggregate([
      { $match: { _id: new ObjectId(rideId) } },
      { $project: { _id: 0, blockList: 1 } },
    ]);

    return blockedRides.length ? blockedRides[0].blockList : [];
  } catch (error) {
    console.log(error);
    throw throwError(500, "Failed to fetch blocked drivers.");
  }
};

// Fetch available drivers based on criteria
exports.fetchAvailableDrivers = async (serviceType, sourceCity, blockList,flag ) => {
  try {
    let matchObj={};
    if(flag == "forManual"){
       matchObj = {
         city: new ObjectId(sourceCity),
         serviceType: serviceType, 
         approved: true,
         isAvailable: true,
         inRide: false,
       }
    }else if(flag == "forAuto"){
      matchObj = {
        city: new ObjectId(sourceCity),
        serviceType: serviceType, 
        approved: true,
        inRide: false,
      }
    }
    let drivers = await driverModel.aggregate([
      {
        $match: matchObj,
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
          inRide: 1,
          driverProfile: 1,
          driverEmail: 1,
        },
      },
    ]);

    // Filter out blocked drivers
    drivers = drivers.filter(
      (driver) => !blockList.includes(driver._id.toString())
    );
    return drivers;
  } catch (error) {
    console.log(error)
    throw throwError(500, "Failed to fetch available drivers.");
  }
};

// get all confirmed rides except cancelled
exports.getConfirmedRides = async () => {
  try {
    let rides = await rideModel.aggregate([
      {
        $match: {
          $nor: [{ status: "cancelled" }],
        },
      },
      ...pipeline,
    ]);
    return rides;
  } catch (err) {
    return throwError(500, "Mongoose Error while getting rides from database");
  }
};

// patch cancel ride
exports.patchCancleRide = async (rideId) => {
  try {
    await rideModel.findOneAndUpdate(
      { _id: rideId },
      { status: "cancelled", $unset:{driverId:1,AcceptanceStatus:1,timeOfAssign:1} },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    throw throwError(500, "Mongoode Error While updating ride status");
  }
};

// get Ride In Formated Mannenr
exports.getRideInFormatedMannenr = async (rideId) => {
  try {
    let ride = await rideModel.aggregate([
      {
        $match: {
          _id: new ObjectId(rideId),
        },
      },
      ...pipeline2,
    ]);
    return ride[0];
  } catch (err) {
    console.log(err);
    throw throwError(500, "Mongoode Error While getting ride from database");
  }
};

// Assign Ride To Driver
exports.assignRideToDriver = async (rideId, driverId) => {
  try {
    await rideModel.findOneAndUpdate(
      { _id: rideId },
      {
        driverId: driverId,
        timeOfAssign: new Date(),
        $addToSet: { blockList: driverId },
        AcceptanceStatus: 2,
      },
      { new: true }
    );
    await driverModel.findOneAndUpdate(
      { _id: driverId },
      { $set: { isAvailable: false } }
      // { new: true }
    );
  } catch (err) {
    console.log(err);
    throw throwError(500, "Mongoode Error While updating ride status");
  }
};

exports.updateRideStatus = async (rideId, status) => {
  try {
    await rideModel.findOneAndUpdate(
      { _id: rideId },
      {
        status: status,
        blockList: [],
        $unset: { driverId: 1, timeOfAssign: 1, AcceptanceStatus: 1 },
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    throw throwError(500, "Mongoode Error While updating ride status");
  }
};
