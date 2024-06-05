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
    res.send({ vehiclePricing: data });
  } catch (err) {
    console.log(err.message);
    res.send({ error: err.message });
  }
};

exports.postVehiclePricing = async (req, res) => {
  let data = req.body;
  try {
    let vehicle = new vehiclePricing(data);
    let result = await vehicle.save();
    let vehicleType = req.body.vehicleType;
    let tempzone = await zoneModel.findOneAndUpdate(
      { _id: req.body.city },
      {
        $set: {
          "pricing.$[elem].pricingId": result._id,
          "pricing.$[elem].hasvalue":true
        },
      },
      { arrayFilters: [{ "elem.vtype": vehicleType }] }
    );
    tempzone.save();
    let id = new ObjectId(result._id);
    output = await vehiclePricing.aggregate([
      { $match: { _id: id } },
      ...pipeline,
    ]);
    res.send({ vehiclePricing: output[0] });
  } catch (err) {
    console.log(err.message);
    res.send({ error: err.message });
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
    res.send({ vehiclePricing: output[0] });
  } catch (err) {
    console.log(err.message);
    res.send({ error: err.message });
  }
};
