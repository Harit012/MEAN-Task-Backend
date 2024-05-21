const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  countryName: {
    type: String,
    required: true,
  },
  boundry: {
    type: [{ lat: Number, lng: Number }],
    required: true,
  },
  zoneName: {
    type: String,
    required: true,
    unique: true,
  },
  countryShortName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("zone", zoneSchema);
