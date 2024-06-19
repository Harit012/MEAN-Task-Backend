const vehiclePricing = require("../../models/vehiclePricing");
const zoneModel = require("../../models/zone");

const ObjectId = require("mongodb").ObjectId;

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
  try {
    let data = await vehiclePricing.aggregate([...pipeline]);
    res.status(200).send({status:"Success", vehiclePricing: data });
  } catch (err) {
    res.status(500).send({status:"Failure", message: "can not get vehicle-pricing from server" });
  }
};

exports.postVehiclePricing = async (req, res) => {
  let data = req.body;
  try {
    let vehicle = new vehiclePricing(data);
    let result = await vehicle.save();
    let id = new ObjectId(result._id);
    output = await vehiclePricing.aggregate([
      { $match: { _id: id } },
      ...pipeline,
    ]);
    res.status(200).send({status:"Success", vehiclePricing: output[0] });
  } catch (err) {
    res.status(500).send({status:"Failure", message: "can not add vehicle-pricing in server" });
  }
};

exports.patchVehiclePricing = async (req, res) => {
  try {
    let id = new ObjectId(req.body._id);
    await vehiclePricing.findOneAndUpdate({ _id: id }, req.body);
    let output = await vehiclePricing.aggregate([
      { $match: { _id: id } },
      ...pipeline,
    ]);
    res.status(200).send({status:"Success", vehiclePricing: output[0] });
  } catch (err) {
    res.status(500).send({status:"Failure", message: "can not update vehicle-pricing in server" });
  }
};
