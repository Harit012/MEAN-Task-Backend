const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{16}$/,

    },
    expiryDate: {
        type: String,
        required: true,
        match: /^[0-9]{2}\/[0-9]{2}$/
    },
    cvv: {
        type: Number,
        required: true,
        min:100,
        max:999
    },
    cardHolderName:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("card", cardSchema)