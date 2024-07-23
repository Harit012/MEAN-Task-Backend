const SettingsModel = require("../../models/settings");
const ObjectId = require("mongodb").ObjectId;

exports.getSettings = async (req, res) => {
  // setTimeout(async () => {
    try {
      let setting = await SettingsModel.find();
      res.send({ success: true, settings: setting[0] });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, error: "Cannot get settings from server" });
    }
  // }, 2000);
};

exports.patchSettings = async (req, res) => {
  // setTimeout(async () => {
  try {
    const id = new ObjectId("665e91b8e54b312a06e372b6");
    let timeOut = req.body.timeOut;
    let stops = req.body.stops;
    await SettingsModel.findOneAndUpdate(
      { _id: id },
      { timeOut: timeOut, stops: stops }
    );
    res.send({
      success: true,
      message: "Settings Updated Successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: "Cannot update settings on server",
    });
  }
  // }, 2000);
};
