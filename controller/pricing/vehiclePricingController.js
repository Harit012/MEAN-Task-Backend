const vehiclePricing = require("../../models/vehiclePricing");

const pipeline = [
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
      country: "$country.countryName",
      city: "$city.zoneName",
      vehicleType: 1,
      driverProfit: 1,
      minFare: 1,
      distanceForBasePrice: 1,
      basePrice: 1,
      pricePerUnitDistance: 1,
      pricePerUnitTime: 1,
      maxSpace: 1,
    },
  },
];

exports.getVehiclePricing = async (req, res) => {
  let data = await vehiclePricing.aggregate(pipeline);
  res.send(data);
};

exports.postVehiclePricing = async (req, res) => {
  let data = req.body;
  let vehicle = new vehiclePricing(data);
  let result = await vehicle.save();
  res.send(result);
};
