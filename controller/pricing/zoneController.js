zoneModel = require("../../models/zone");
const { ObjectId } = require("mongodb");

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
    $project: {
      _id: 1,
      country: {
        countryName: "$country.countryName",
        countryShortName: "$country.countryShortName",
        countryId: "$country._id",
      },
      boundry: 1,
      zoneName: 1,
    },
  },
];

exports.getZone = async (req, res) => {
  const country = new ObjectId(req.query.countryId);

  try {
    const zone = await zoneModel.aggregate([
      {
        $match: { country: country },
      },
      ...pipeline,
    ]);
    res.send({ zones: zone });
  } catch (err) {
    res.send({ error: err });
  }
};

exports.postZone = async (req, res) => {
  if (!req.body.country || !req.body.boundry || !req.body.zoneName) {
    res.send({ error: "Please enter all the fields" });
  } else {
    try {
      const zone = new zoneModel({
        boundry: req.body.boundry,
        zoneName: req.body.zoneName,
        country: req.body.country,
        pricing: [
          { vtype: "SEDAN", hasvalue: false },
          { vtype: "SUV", hasvalue: false },
          { vtype: "MINI VAN", hasvalue: false },
          { vtype: "PICK UP", hasvalue: false },
        ],
      });
      const country = new ObjectId(req.body.country);

      await zone.save();
      const zones = await zoneModel.aggregate([
        { $match: { country: country } },
        ...pipeline,
      ]);
      res.send({ zones: zones });
    } catch (err) {
      console.log("error Occured at line 92");
      if (err.errorResponse == 11000) {
        res.send({ error: `zone at ${req.body.zoneName} already exists` });
      } else {
        res.send({ error: err.message });
      }
    }
  }
};

exports.patchzone = async (req, res) => {
  try {
    if (req.body.id != "" && req.body.boundry != []) {
      const updatedZone = await zoneModel.findOneAndUpdate(
        { _id: req.body.id },
        { boundry: req.body.boundry }
      );
      updatedZone.save();
      const id = new ObjectId(req.body.id);
      let fatchedUpdatedZone = await zoneModel.aggregate([
        { $match: { _id: id } },
        ...pipeline,
      ]);
      res.send({ zone: fatchedUpdatedZone[0] });
    } else {
      console.log("error in line 65");
      res.send({ error: "Provided Fields are not correct !!" });
    }
  } catch (err) {
    console.log("error in line 68");
    console.log(err.errorResponse);
    res.send({ error: err.message });
  }
};

exports.getzoneforpricing = async (req, res) => {
  const city = new ObjectId(req.query.cityId);
  try {
    const zones = await zoneModel.aggregate([
      { $match: { _id: city } },
      {
        $project: {
          _id:0,
          pricing: 1,
        },
      },
    ]);
    res.send(zones[0]);
  } catch (err) {
    res.send( err.message );
  }
};
