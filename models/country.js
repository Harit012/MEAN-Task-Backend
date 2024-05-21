const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  countryName: {
    type: String,
    required: true,
    unique: true,
  },
  currency: {
    type: String,
    required: true,
  },
  countryCallCode: {
    type: String,
    required: true,
  },
  FlagUrl: {
    type: String,
    required: true,
  },
  timezones: {
    type: [String],
    required: true,
  },
  latlng: {
    type: [Number],
    required: true,
  },
  countryShortName:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("country", countrySchema);
