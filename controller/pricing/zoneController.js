zoneModel = require("../../models/zone");
 const { ObjectId } = require("mongodb");

const pipeline =[{
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
},]

exports.getZone = async (req, res) => {
  const country = new ObjectId(req.query.countryId);

  try {
    const zone = await zoneModel.aggregate([
      {
        $match: { country : country },
      },
      ...pipeline
    ]);
    res.send({ zones: zone });
  } catch (err) {
    res.send({ error: err });
  }
};

exports.postZone = async (req, res) => {
  if (
    !req.body.country ||
    !req.body.boundry ||
    !req.body.zoneName
  ) {
    res.send({ error: "Please enter all the fields" });
  } else {
    try {
      const zone = new zoneModel({
        boundry: req.body.boundry,
        zoneName: req.body.zoneName,
        country: req.body.country,
      });
      const country = new ObjectId(req.body.country);

      await zone.save();
      const zones = await zoneModel.aggregate([
        { $match: { country: country } },
        ...pipeline
      ]);
      res.send({ zones: zones });
    } catch (err) {
      console.log("error Occured at line 92");
      if (err.errorResponse.code == 11000) {
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
        ...pipeline
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
