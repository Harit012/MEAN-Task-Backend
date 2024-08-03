const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    timeOut:{
        type:Number,
        default:30,
        require:true
    },
    stops:{
        type:Number,
        default:3,
        require:true
    },
    mailerPassword:{
        type:String,
        require:true
    },
    mailerUser:{
        type:String,
        require:true
    },
    stripePublishableKey:{
        type:String,
        require:true
    },
    stripeSecretKey:{
        type:String,
        require:true
    },
    twilioAccountSid:{
        type:String,
        require:true
    },
    twilioAuthToken:{
        type:String,
        require:true
    },
    twilioPhoneNumber:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model("setting", settingSchema)