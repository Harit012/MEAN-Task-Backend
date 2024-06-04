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
    }
});

module.exports = mongoose.model("setting", settingSchema)