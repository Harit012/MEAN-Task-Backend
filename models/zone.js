const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  boundry: {
    type: [{ lat: Number, lng: Number }],
    required: true,
  },
  zoneName: {
    type: String,
    required: true,
    unique: true,
  },
  country:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "country",
    required: true,
  }
  // countryName: {
  //   type: String,
  //   required: true,
  // },
  // countryShortName: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model("zone", zoneSchema);
