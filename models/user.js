const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userProfile:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    userName:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        match:/^[0-9]{10}$/,
        unique:true
    },
    country:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    customerId:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("user", userSchema);