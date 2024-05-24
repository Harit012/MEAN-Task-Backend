const mongoose = require("mongoose");

const vehiclePricingSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "country",
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "zone",
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  driverProfit: {
    type: Number,
    required: true,
  },
  minFare: {
    type: Number,
    required: true,
  },
  distanceForBasePrice: {
    type: Number,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  pricePerUnitDistance: {
    type: Number,
    required: true,
  },
  pricePerUnitTime: {
    type: Number,
    required: true,
  },
  maxSpace: {
    type: Number,
    required: true,
  },
  ccv:{
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model("vehiclePricing", vehiclePricingSchema);
