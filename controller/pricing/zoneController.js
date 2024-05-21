zoneModel = require("../../models/zone");

exports.getZone = async (req, res) => {
  let country = req.query.countryShortName;
  try {
    const zone = await zoneModel.find({ countryShortName: country });
    res.send({ zones: zone });
  } catch (err) {
    res.send({ error: err });
  }
};

exports.postZone = async (req, res) => {
  if (
    !req.body.countryName ||
    !req.body.boundry ||
    !req.body.zoneName ||
    !req.body.countryShortName
  ) {
    res.send({ error: "Please enter all the fields" });
  } else {
    try {
      const zone = new zoneModel({
        countryName: req.body.countryName,
        boundry: req.body.boundry,
        zoneName: req.body.zoneName,
        countryShortName: req.body.countryShortName,
      });
      await zone.save();
      const zones = await zoneModel.find({
        $or: [
          { name: req.body.countryName },
          { countryShortName: req.body.countryShortName },
        ],
      });
      res.send({ zones: zones });
    } catch (err) {
      console.log("error Occured at line 43");
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
      let fatchedUpdatedZone = await zoneModel.findOne({ _id: req.body.id });
      res.send({ zone: fatchedUpdatedZone });
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
