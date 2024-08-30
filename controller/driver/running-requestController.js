const rideModel = require("../../models/ride");
const driverModel = require("../../models/driver");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mailing = require("../messaging/mailer");
const messaging = require("../messaging/sms");
const { ObjectId } = require("mongodb");
const query = require("../../Database Operations/driver/runningRequest");
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
      driverProfit: 1,
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
                { status: { $ne: "assignedToAny" } },
                { status: { $ne: "assignedToOne" } },
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
            {
              $or: [
                { status: { $eq: "assignedToAny" } },
                { status: { $eq: "assignedToOne" } },
              ],
            },
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

exports.patchStatusChange = async (req, res, next) => {
  try {
    query.statusChange(req.body.rideId, req.body.status);
    let ride = await query.rideToSend(req.body.rideId);
    res.status(200).send({ success: true, ride: ride });
    global.io.emit("changeStatusFromServer", ride);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "can not change status from server",
    });
  }
};

exports.patchDriverResponse = async (req, res) => {
  try {
    let ride = await rideModel.findOneAndUpdate(
      { _id: req.body.rideId },
      { AcceptanceStatus: req.body.response }
    );

    if (req.body.response == 0) {
      await driverModel.findOneAndUpdate(
        { _id: ride.driverId },
        { $set: { isAvailable: true } }
      );
      global.io.emit("Rejected", { rideId: req.body.rideId });
    } else if (req.body.response == 1) {
      await query.acceptRideByDriver(req.body.rideId);

      let rideTOsend = await query.rideToSend(req.body.rideId);
      messaging.sendSMS(rideTOsend.status,rideTOsend.callCode,rideTOsend.userPhone,rideTOsend);
      global.io.emit("acceptRideFromServer", rideTOsend);
      global.io.emit("cronEnd", {
        message: "Accepted",
        rideId: rideTOsend._id,
      });
    }
    res.status(200).send({ success: true, message: "updated" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not block driver from server" });
  }
};

exports.patchCompleteRide = async (req, res) => {
  try {
    //change status to completed
    query.statusChange(req.body.rideId, "completed");
    // getting ride
    let ride = await query.rideToSend(req.body.rideId);
    // changing availability of Driver
    await driverModel.findOneAndUpdate(
      { _id: ride.driverId },
      { $set: { isAvailable: true } }
    );
    
    res.status(200).send({ success: true, ride: ride });
   
    global.io.emit("CompletedRide", ride);

    mailing.sendMail("Ride Completed", ride.userEmail,ride.userName,"user",ride);
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "can not complete ride from server" });
  }
};


exports.paymentProcess = async (req, res) => {
  try {
    let ride = req.body;
    await rideModel.findOneAndUpdate({_id:ride.id},{$set:{rating:ride.rating}},{new:true});
    if (ride.paymentMethod == "card") {
      await paymentConformation(ride.csn, ride.customerId, ride.price);
    }
    messaging.sendSMS("Payment Done",ride.callCode,ride.userPhone,ride);
    if (url == "empty") {
      res.status(200).send({ success: true, message: "Payment Completed" });
    } else {
      res.status(200).send({ success: true, link: url });
    }
    if (ride.paymentMethod == "card") {
      let account = await stripe.accounts.retrieve(ride.driver_stripe_id);
      if(account.capabilities.transfers == "active"){
        await paymentToDriver(ride.driver_stripe_id, ride.driverProfit);
      }
      else{
        console.log("can not transfer money")
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({success: false, message: "Error in pament completion"});
  }
}

exports.proxyrequest = async (req, res) => {
  try {
    res.send({
      success: true,
      acc:"done"
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
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
  }
}

async function paymentToDriver(driver_stripe_id, driverProfit) {
  await stripe.transfers.create({
    // amount: driverProfit/50,
    amount: 100,
    currency: 'usd',
    destination: driver_stripe_id,
    transfer_group: 'ORDER_95',
  });
  // console.log(transfer)
}