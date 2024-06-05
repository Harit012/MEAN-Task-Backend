const vehicleModel = require("../../models/vehicle");
const fs = require("fs");
const path = require("path");
exports.postVehicle = async (req, res) => {
  if (!req.file || !req.body.type) {
    res.send({ error: "Please enter all the fields" });
  } else {
    let file = req.file.path;
    file = file.slice(6, file.length);
    try {
      const vehicle = new vehicleModel({
        vehicleImage: file,
        type: req.body.type,
      });
      await vehicle.save();
      const vehicles = await vehicleModel.find();
      res.send({ vehicles: vehicles });
    } catch (err) {
      console.log(err);
    }
  }
};

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleModel.find();
    res.send({ vehicle });
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.putVehicle = async (req, res) => {
  if (req.file) {
    file = req.file.path;
    file = file.slice(6, file.length);
    fs.unlink(
      path.join(__dirname, `../../public/${req.body.prvImg}`),
      (res) => {}
    );
  } else {
    file = req.body.prvImg;
  }
  try {
    const vehicle = await vehicleModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        vehicleImage: file,
        type: req.body.type,
      }
    );
    const vehicles = await vehicleModel.find();
    res.send({ vehicles: vehicles });
  } catch (err) {
    console.log("error Occured");
    console.log({error:err.message});
  }
};
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleModel.findByIdAndDelete(req.query.id);
    const vehicles = await vehicleModel.find();
    res.send({ vehicles: vehicles });
    fs.unlink(
      path.join(__dirname, `../../public/${vehicle.vehicleImage}`),
      (res) => {}
    );
  } catch (err) {
    console.log(err);
  }
};
