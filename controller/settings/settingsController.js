const SettingsModel = require("../../models/settings");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const path = require("path");
exports.getSettings = async (req, res) => {
  try {
    let setting = await SettingsModel.find();
    res.send({ success: true, settings: setting[0] });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, error: "Cannot get settings from server" });
  }
};

exports.patchSettings = async (req, res) => {
  // setTimeout(async () => {
  try {
    const id = new ObjectId("665e91b8e54b312a06e372b6");

    let settings = await SettingsModel.findOneAndUpdate(
      { _id: id },
      {
        timeOut: req.body.timeOut,
        stops: req.body.stops,
        mailerPassword: req.body.mailerPassword,
        mailerUser: req.body.mailerUser,
        stripePublishableKey: req.body.stripePublishableKey,
        stripeSecretKey: req.body.stripeSecretKey,
        twilioAccountSid: req.body.twilioAccountSid,
        twilioAuthToken: req.body.twilioAuthToken,
        twilioPhoneNumber: req.body.twilioPhoneNumber,
      }
    );
    fs.writeFile(path.join(__dirname, "../../.env"), 
      `
      SECRET = "Harit"
      EXPIRE_TOKEN = "3h"
      PORT = 3000
      CLUSTER_PASSWORD = "Hacoonamatata"
      CONNECTION_STRING ="mongodb+srv://Harit:Hacoonamatata@cluster0.ksfn8lt.mongodb.net/angularBackend?retryWrites=true&w=majority&appName=Cluster0"
      STRIPE_PUBLIC_KEY =${settings.stripePublishableKey}
      STRIPE_SECRET_KEY =${settings.stripeSecretKey}
      TWILIO_ACCOUNT_SID = ${settings.twilioAccountSid}
      TWILIO_AUTH_TOKEN = ${settings.twilioAuthToken}
      TWILIO_PHONE_NUMBER = ${settings.twilioPhoneNumber}
      NODE_MAILER_USER = ${settings.mailerUser}
      NODE_MAILER_PASSWORD = ${settings.mailerPassword}
      `
    ,(err) => {
      if (err) throw err
    }
  );
    res.send({
      success: true,
      message: "Settings Updated Successfully",
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      error: "Cannot update settings on server",
    });
  }
  // }, 2000);
};
