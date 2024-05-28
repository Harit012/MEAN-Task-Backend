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
        type:Number,
        required:true,
        unique:true
    },
    country:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    cards:{
        type:[mongoose.Schema.Types.ObjectId],
        required:false
    }
})
module.exports = mongoose.model("user", userSchema);