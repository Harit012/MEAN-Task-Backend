const rideModel = require("../../models/ride");

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

// get all rides
exports.getAllRides = async (req, res) => {
  try {
    let rides = await rideModel.aggregate([
      {
        $match: {
          $or: [
            { status: { $eq: "completed" } },
            { status: { $eq: "cancelled" } },
          ],
        },
      },
      ...pipeline,
    ]);
    res.status(200).send({ success: true, rides: rides });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not get all rides from server" });
  }
};

exports.getRodesForDownload = async (req, res) => {
  try {
    let rides = await rideModel.aggregate([
      {
        $match: {
          $or: [
            { status: "completed" },
            { status: "cancelled" }
          ]
        }
      },
      {
        $facet: {
          withDriverId: [
            {
              $match: { driverId: { $exists: true } }
            },
            {
              $lookup: {
                from: "drivers",
                localField: "driverId",
                foreignField: "_id",
                as: "driver"
              }
            },
            {
              $unwind: "$driver"
            },
            {
              $project: {
                _id:0,
                source: 1,
                destination: 1,
                time: 1,
                distance: 1,
                serviceType: 1,
                paymentMethod: 1,
                rideTime: 1,
                price: 1,
                userName: 1,
                userPhone: 1,
                driverName: "$driver.driverName",
                driverPhone: "$driver.phone"
              }
            }
          ],
          withoutDriverId: [
            {
              $match: { driverId: { $exists: false } }
            },
            {
              $project: {
                _id:0,
                source: 1,
                destination: 1,
                time: 1,
                distance: 1,
                serviceType: 1,
                paymentMethod: 1,
                rideTime: 1,
                price: 1,
                userName: 1,
                userPhone: 1,
                driverName: { $literal: "NOT Assigned" },
                driverPhone: { $literal: "NOT Assigned" }
              }
            }
          ]
        }
      },
      {
        $project: {
          combined: { $concatArrays: ["$withoutDriverId", "$withDriverId"] }
        }
      },
      {
        $unwind: "$combined"
      },
      {
        $replaceRoot: { newRoot: "$combined" }
      }
    ]);
    res.status(200).send({ success: true, rides: rides });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not get all rides from server",
    });
  }
};
