const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


router.use('',async function(req, res, next) {
  let connectToAtlas = true
  if(connectToAtlas){
    try {
      await mongoose.connect(process.env.CONNECTION_STRING);
      // // console.log("Altlas connected");
      next();
    } catch (err) {
      console.log("Connection failed with Database");
      res.status(500).send({status:"Failure",message:"Database not connected"})
    }
  }else{
    try {
        await mongoose.connect("mongodb://localhost:27017/angularbackend");
        // // console.log("Compass connected");
        next();
      } catch (err) {
        console.log("Connection failed with Database");
        res.status(500).send({status:"Failure",message:"Database not connected"})
      }
  }  
})

module.exports = router;
