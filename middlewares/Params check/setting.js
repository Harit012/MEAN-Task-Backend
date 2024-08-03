exports.patchSettingsParamsCheck = (req, res, next) => {
  if (
    req.body.timeOut &&
    req.body.stops &&
    req.body.mailerPassword &&
    req.body.mailerUser &&
    req.body.stripePublishableKey &&
    req.body.stripeSecretKey &&
    req.body.twilioAccountSid &&
    req.body.twilioAuthToken &&
    req.body.twilioPhoneNumber
  ) {
    next();
  } else {
    res.status(400).send({ success: false, error: "no request body recived" });
  }
};
