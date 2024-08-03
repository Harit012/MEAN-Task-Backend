const SettingsModel = require("../../models/settings");
const ObjectId = require("mongodb").ObjectId;
const fs = require('fs');
const path = require('path');
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

    await SettingsModel.findOneAndUpdate(
      { _id: id },
      {
        timeOut: req.body.timeOut,
        stops: req.body.stops,
        mailerPassword: req.body.mailerPassword,
        mailerUser: req.body.mailerUser,
        stripePublishableKey:req.body.stripePublishableKey,
        stripeSecretKey:req.body.stripeSecretKey,
        twilioAccountSid:req.body.twilioAccountSid,
        twilioAuthToken:req.body.twilioAuthToken,
        twilioPhoneNumber:req.body.twilioPhoneNumber
      }
    );
    // let env = fs.readFileSync(path.join(__dirname, "../../.env"), 'utf8');
    // const envVariables = {};
    // console.log(env.split('\n'))
    // env.split('\n').forEach(line => {
    //   const [key, value] = line.split('=');
    //   envVariables[key.trim()] = value.trim();
    // });
    // console.log(envVariables)
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
