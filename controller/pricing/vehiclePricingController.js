const vehiclePricing = require("../../models/vehiclePricing");
// const countryModel = require("../../models/country");
// const zoneModel = require("../../models/zone");

exports.getVehiclePricing = async (req, res) => {
  let data = await vehiclePricing.aggregate([
    {
      $lookup: {
        from: "countries",
        localField: "country",
        foreignField: "_id",
        as: "country",
      },
    },
    {
      $unwind: "$country",
    },
    {
      $lookup: {
        from: "zones",
        localField: "city",
        foreignField: "_id",
        as: "city",
      },
    },
    {
        $unwind: "$city",
    },
    {
      $project: {
        _id: 1,
        country: {
            countryName: 1
        },
        city: {
            zoneName: 1
        },
        vehicleType: 1,
        driverProfit: 1,
        minFare: 1,
        distanceForBasePrice: 1,
        basePrice: 1,
        pricePerUnitDistance: 1,
        pricePerUnitTime: 1,
        maxSpace: 1
      }
    }
  ]);
  res.send(data);
};

exports.postVehiclePricing = async (req, res) => {
  let data = req.body;
  let vehicle = new vehiclePricing(data);
  let result = await vehicle.save();
  res.send(result);
};
