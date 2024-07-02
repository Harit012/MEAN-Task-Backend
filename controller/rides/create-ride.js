const { ObjectId } = require("mongodb");
const userModel = require("../../models/user");
const vehiclePricingModel = require("../../models/vehiclePricing");
const { patchzone } = require("../pricing/zoneController");

const pipeline = [
  {
    $project: {
      _id: 0,
      userName: 1,
      email: 1,
      phone: 1,
      country: {
        _id: "$country._id",
        countryShortName: "$.country.countryShortName",
      },
    },
  },
];

exports.postVerifyUserwithPhone = async (req, res) => {
  try {
    let reqphone = req.body.phone;
    // console.log(phone)
    let user = await userModel.aggregate([
      { $match:  {phone: {$regex: reqphone}}},
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      { $unwind: "$country" },
      {
        $project: {
          _id: 1,
          userName: 1,
          userEmail: 1,
          phone: 1,
          country: {
            _id: 1,
            countryShortName: 1,
            currency:1
          },
        },
      },
    ]);
    res.status(200).send({ status: "Success", user: user[0] });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Failure", message: "Error From Server" });
  }
};


exports.getPricingsForCity = async (req, res) => {
  try{
    let city = new ObjectId(req.query.city) 
    let pricings = await vehiclePricingModel.aggregate([
      {
        $match:{
          city: city
        }
      },
      {
        $project:{
          _id: 1,
          vehicleType: 1,
          driverProfit: 1,
          minFare: 1,
          distanceForBasePrice:1,
          basePrice:1,
          pricePerUnitDistance:1,
          pricePerUnitTime:1,
          maxSpace:1
        }
      }
    ])

    res.status(200).send({status:"Success",pricings:pricings})
  }
  catch(err){
    res.status(500).send({status:"Failure",message:"Error From Server"})
  }
}