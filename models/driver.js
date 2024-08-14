const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    driverProfile: {
        type: String,
        required: true,
    },
    driverEmail: {
        type: String,
        required: true,
        unique: true,
    },
    driverName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/,
        unique: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "country",
        required: true,
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "zone",
        required: true,
    },
    approved:{
        type:Boolean,
        default:false
    },
    serviceType:{
        type:String,
        default:"none",
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    driver_stripe_id:{
        type:String
    }
});

module.exports = mongoose.model("driver", driverSchema)