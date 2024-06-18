const SettingsModel = require("../../models/settings");
const ObjectId = require("mongodb").ObjectId;

exports.getSettings = async (req, res) => {
  setTimeout(async () => {
    try {
      let setting = await SettingsModel.find();
      res.send({ settings: setting[0] });
    } catch (err) {
      res.send({ error: err.message });
    }
  },2000)
  
};

exports.patchSettings = async (req, res) => {
  setTimeout(async () => {

  try {
    const id = new ObjectId("665e91b8e54b312a06e372b6");
    let timeOut = req.body.timeOut;
    let stops = req.body.stops;
    await SettingsModel.findOneAndUpdate(
      { _id: id },
      { timeOut: timeOut, stops: stops }
    );
    res.send({ message:"Settings Updated Successfully" });
  } catch (err) {
    res.send({ error: err.message });
  }
},2000)

};
