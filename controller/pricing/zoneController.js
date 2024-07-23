const zoneModel = require("../../models/zone");
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
      res.status(200).send({ success: true, zones: zone });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: "can not get City/Cities from server",
      });
    }
};

exports.postZone = async (req, res) => {
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
      res.send({ success: true, zones: zones });
    } catch (err) {
      if (err.errorResponse == 11000) {
        res.status(409).send({
          success: false,
          message: `zone at ${req.body.zoneName} already exists`,
        });
      } else {
        res.status(500).send({
          success: false,
          message: "can not Add City/Zone in server",
        });
      }
    }
};

exports.patchzone = async (req, res) => {
  // if (req.body.id && req.body.boundry ) {
    try {
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
      res.status(200).send({ success: true, zone: fatchedUpdatedZone[0] });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, error: "Cannot update zone in server" });
    }
  // } else {
  //   res
  //     .status(400)
  //     .send({
  //       status: "Failure",
  //       message: "Provided Fields are not correct !!",
  //     });
  // }
};
