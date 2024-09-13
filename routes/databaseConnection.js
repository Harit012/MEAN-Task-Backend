const mongoose = require("mongoose");

exports.connection = async function () {
  let connectToAtlas = true;
  if (connectToAtlas) {
    try {
      await mongoose.connect(process.env.CONNECTION_STRING);
      // // console.log("Altlas connected");
    } catch (err) {
      console.log("Connection failed with Database", err);
    }
  } else {
    try {
      await mongoose.connect("mongodb://44.201.133.98:27017/angularbackendTest");
      // // console.log("Compass connected");
    } catch (err) {
      console.log("Connection failed with Database");
  }
}
};
