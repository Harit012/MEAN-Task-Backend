const settingModel = require("../../models/settings");
exports.sendSMS = async (status,callCode,phone,ride) => {
    let settings = await settingModel.findOne();
    const accountSid = settings.twilioAccountSid;
    const authToken = settings.twilioAuthToken;
    const phoneNummber = settings.twilioPhoneNumber;
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const phoneNummber = process.env.TWILIO_PHONE_NUMBER

    let message;
    if(status != "Payment Done"){
        message = `${ride.driverName} has ${status} ride.`
    }
    else{
        message = `Your Payment has been recived Successfully for ride`
    }

const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: message,
    // to: `${callCode}${phone}`,
    to: `+917046856351`, 
    from: phoneNummber,
  })
  .then((message) => {return true}, (err) => console.log(err));
}