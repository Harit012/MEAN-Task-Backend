const rideModel = require("../../models/ride");
const { ObjectId } = require("mongodb");
const settingsModel = require("../../models/settings");
const query = require("./../../Database Operations/rides/confirmRides");

exports.getAllDrivers = async (req, res) => {
  let sourceCity = req.query.cityId;
  let serviceType = req.query.serviceType;
  let rideId = req.query.rideId;
  try {
    let blocked = await query.fetchBlockedDrivers(rideId);
    let drivers = await query.fetchAvailableDrivers(
      serviceType,
      sourceCity,
      blocked,
      "forManual"
    );

    res.status(200).send({
      success: true,
      driversList: drivers,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not get drivers from server",
    });
  }
};

exports.getConfirmedRides = async (req, res) => {
  try {
    let rides = await query.getConfirmedRides();
    res.status(200).send({ success: true, rides: rides });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not get confirmed rides from server",
    });
  }
};

exports.patchCancleRide = async (req, res) => {
  try {
    let rideId = req.body.rideId;

    await query.patchCancleRide(rideId);

    let updatedRide = await query.getRideInFormatedMannenr(rideId);

    res.status(200).send({ success: true, message: "ride cancelled" });
    global.io.emit("cancelRide", updatedRide);
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not cancel ride from server" });
  }
};

exports.patchAssingDriverManually = async (req, res) => {
  try {
    await rideModel.findOneAndUpdate({_id:req.body.rideId},{status:"assignedToOne"});
    await query.assignRideToDriver(
      req.body.rideId,
      req.body.driverId
    );

    let ride = await query.getRideInFormatedMannenr(req.body.rideId);
    global.io.emit("assignRideFromServer", ride);
    res.status(200).send({ success: true, ride: ride });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.patchAssignToAnyDriver = async (req, res) => {
  try {
    let updatedRide = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { status: "assignedToAny" },
      { new: true }
    );

    res.status(200).send({ success: true, ride: updatedRide });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not assign driver from server",
    });
  }
};

exports.getTimeOut = async (req, res) => {
  try {
    let settings = await settingsModel.aggregate([
      { $match: { _id: new ObjectId("665e91b8e54b312a06e372b6") } },
      { $project: { timeOut: 1 } },
    ]);
    settings = settings[0].timeOut;
    res.status(200).send({ success: true, timeOut: settings });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not get TimeOut from server" });
  }
};
