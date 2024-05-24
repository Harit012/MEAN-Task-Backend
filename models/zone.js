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
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "country",
    required: true,
  },
  pricing:{
    type:[
        {vtype: String, hasvalue: Boolean ,pricingId:mongoose.Schema.Types.ObjectId},
        {vtype: String, hasvalue: Boolean ,pricingId:mongoose.Schema.Types.ObjectId},
        {vtype: String, hasvalue: Boolean ,pricingId:mongoose.Schema.Types.ObjectId},
        {vtype: String, hasvalue: Boolean ,pricingId:mongoose.Schema.Types.ObjectId},     
   ],
   required:false
  } 
  
});

module.exports = mongoose.model("zone", zoneSchema);
