const mongoose = require("mongoose");


const vehicleSchema = new mongoose.Schema({
  vehicleImage:{
    type: String,
    required: true,
  },
  type:{
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("vehicle", vehicleSchema);
