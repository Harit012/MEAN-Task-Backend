const rideModel = require("../../models/ride");
const driverModel = require("../../models/driver");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const appSocket = require("../../app");
const mailing = require("../messaging/mailer");
const messaging = require("../messaging/sms");
const { ObjectId } = require("mongodb");
let url = "empty";
const pipeline = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "drivers",
      localField: "driverId",
      foreignField: "_id",
      as: "driver",
    },
  },
  { $unwind: "$driver" },
  {
    $project: {
      _id: 1,
      source: 1,
      destination: 1,
      time: 1,
      distance: 1,
      serviceType: 1,
      paymentMethod: 1,
      rideTime: 1,
      price: 1,
      stops: 1,
      userName: 1,
      userPhone: 1,
      rideId: 1,
      rideType: 1,
      userProfile: "$user.userProfile",
      status: 1,
      endPoints: 1,
      stopPoints: 1,
      driverName: "$driver.driverName",
      driverId: "$driver._id",
    },
  },
];
const pipeline2 = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user",
    },
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "countries",
      localField: "user.country",
      foreignField: "_id",
      as: "country",
    },
  },
  {
    $unwind: "$country",
  },
  {
    $lookup: {
      from: "drivers",
      localField: "driverId",
      foreignField: "_id",
      as: "driver",
    },
  },
  { $unwind: "$driver" },
  {
    $project: {
      _id: 1,
      source: 1,
      destination: 1,
      time: 1,
      distance: 1,
      serviceType: 1,
      paymentMethod: 1,
      rideTime: 1,
      price: 1,
      stops: 1,
      userName: 1,
      userPhone: 1,
      rideId: 1,
      rideType: 1,
      userProfile: "$user.userProfile",
      status: 1,
      endPoints: 1,
      stopPoints: 1,
      driverName: "$driver.driverName",
      driverId: "$driver._id",
      customerId: "$user.customerId",
      csn: "$country.currencyISOName",
      userEmail: "$user.userEmail",
      callCode: "$country.countryCallCode",
    },
  },
];

exports.getRunningRequest = async (req, res) => {
  try {
    let acceptedRides = await rideModel.aggregate([
      {
        $match: {
          $and: [
            { driverId: { $exists: true } },
            {
              $and: [
                { status: { $ne: "completed" } },
                { status: { $ne: "available" } },
              ],
            },
          ],
        },
      },
      ...pipeline,
    ]);
    let newRides = await rideModel.aggregate([
      {
        $match: {
          $and: [
            { driverId: { $exists: true } },
            { status: { $eq: "available" } },
          ],
        },
      },
      ...pipeline,
      {
        $project: {
          driverName: 0,
        },
      },
    ]);
    res.status(200).send({
      success: true,
      acceptedRides: acceptedRides,
      newRides: newRides,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "can not get running request from server",
    });
  }
};

exports.patchAcceptRide = async (req, res) => {
  try {
    let ride = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { status: "accepted" },
      { new: true }
    );

    let rideTOsend = await rideModel.aggregate([
      { $match: { _id: ride._id } },
      ...pipeline2,
    ]);
    await driverModel.findOneAndUpdate(
      { _id: ride.driverId },
      { $set: { isAvailable: false } }
    );
    res.status(200).send({ success: true, ride: rideTOsend[0] });
    messaging.sendSMS(rideTOsend[0].status,rideTOsend[0].callCode,rideTOsend[0].userPhone,rideTOsend[0]);

    // socket
    let io = req.app.get("socketio");
    io.emit("acceptRideFromServer", rideTOsend[0]);
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not accept ride from server" });
  }
};

exports.patchStatusChange = async (req, res, next) => {
  try {
    let UpdatedRide = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { status: req.body.status },
      { new: true }
    );
    let ride = await rideModel.aggregate([
      { $match: { _id: UpdatedRide._id } },
      ...pipeline2,
    ]);
    if (req.body.status == "completed") {
      await driverModel.findOneAndUpdate(
        { _id: ride[0].driverId },
        { $set: { isAvailable: true } }
      );
    }
    res.status(200).send({ success: true, ride: ride[0] });
    let io = req.app.get("socketio");
    // socket
    io.emit("changeStatusFromServer", ride[0]);
    if (ride[0].status == "started" || ride[0].status == "completed") {
      messaging.sendSMS(
        ride[0].status,
        ride[0].callCode,
        ride[0].userPhone,
        ride[0]
      );
    }
    if (ride[0].status == "completed") {
      mailing.sendMail("Ride Completed", ride[0].userEmail,ride[0].userName,"user",ride[0]);
      io.emit("CompletedRide", ride[0]);
      let rideForPayment = ride[0];
      if (rideForPayment.paymentMethod == "card") {
        await paymentConformation(
          rideForPayment.csn,
          rideForPayment.customerId,
          rideForPayment.price
        );
        messaging.sendSMS("Payment Done",rideForPayment.callCode,rideForPayment.userPhone,rideForPayment);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "can not change status from server",
    });
  }
};

exports.patchDeleteDriver = async (req, res) => {
  try {
    let updatedRide = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { $unset: { driverId: 1 } }
    );
    res.status(200).send({ success: true, message: updatedRide });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "can not delete driver from server" });
  }
};

exports.patchBlockDriver = async (req, res) => {
  try {
    await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { $addToSet: { blockList: req.body.driverId } }
    );
    res.status(200).send({ success: true, message: "List Updated" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not block driver from server" });
  }
};

async function paymentConformation(currency, customerId, amount) {
  const customer = await stripe.customers.update(customerId, {});
  let cardId = customer.default_source;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: currency,
    customer: customerId,
    payment_method: cardId,
    confirm: true,
    return_url: "http://localhost:4200/admin/ride/ride-history",
    payment_method_types: ["card"],
  });
  if (paymentIntent["next_action"] != null) {
    url = paymentIntent["next_action"]["redirect_to_url"];
    url = url["url"];
    appSocket.emitLink(url);
  }
}

exports.proxyrequest = async (req, res) => {
  try {
    let sourceCity = "669a0b48446b64024ca0d61d";
    let serviceType = "SUV";
    let rideId = "66aa066102c2d684e85a8c0e";
    let assignedDrivers = ["66949f145279064a36371ba7"];
    let blocked = await rideModel.aggregate([
      {
        $match: {
          _id: new ObjectId(rideId),
        },
      },
      {
        $project: {
          _id: 0,
          blockList: 1,
        },
      },
    ]);
    // creating List of Ids
    let blockList = [];
    blocked.forEach((element) => {
      blockList.push(...element.blockList);
    });
    let drivers = await driverModel.aggregate([
      {
        $match: {
          $and: [
            { city: new ObjectId(sourceCity) },
            { serviceType: serviceType },
            { isAvailable: true },
            { approved: true },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          driverName: 1,
          phone: 1,
          serviceType: 1,
          isAvailable: 1,
          approved: 1,
          country: 1,
          driverProfile: 1,
          driverEmail: 1,
        },
      },
    ]);
    
    // removing blocked drivers
    drivers = drivers.filter(
      (driver) =>
        !(
          blockList.includes(driver._id.toString()) ||
          assignedDrivers.includes(driver._id.toString())
        )
    );

    res.status(200).send({ success: true, drivers: drivers });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "can not get all rides from server" });
  }
};
