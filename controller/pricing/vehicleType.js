const vehicleModel = require("../../models/vehicle");
const vehiclePricing = require("../../models/vehiclePricing");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const pipeline1 = [
  {
    $project: {
      _id: 0,
      type: 1,
    },
  },
];
const pipeline2 = [
  {
    $project: {
      _id: 0,
      vehicleType: 1,
    },
  },
];

exports.postVehicle = async (req, res) => {
  let file = req.file.path;
  file = file.slice(6, file.length);
  try {
    const vehicle = new vehicleModel({
      vehicleImage: file,
      type: (req.body.type).toUpperCase(),
    });
    await vehicle.save();
    const vehicles = await vehicleModel.find();
    res.status(201).send({ status: "Success", vehicles: vehicles });
  } catch (err) {
    fs.unlink(path.join(__dirname, `../../public/${file}`), (res) => {});

    if (err.errorResponse.code === 11000) {
      res
        .status(409)
        .send({ status: "Failure", message: "vehicle type Already Exists" });
    }else{
      res
        .status(500)
        .send({ status: "Failure", message: "can not post to server" });
    }
  }
};
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleModel.find();
    res.status(200).send({ status: "Success", vehicle: vehicle });
  } catch (err) {
    res
      .status(500)
      .send({ status: "Failure", message: "can not get vehicles from server" });
  }
};
exports.putVehicle = async (req, res) => {
  let file = "";
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
    await vehicleModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        vehicleImage: file,
        type: req.body.type,
      }
    );
    const vehicles = await vehicleModel.find();
    res.status(200).send({ status: "Success", vehicles: vehicles });
  } catch (err) {
    res
      .status(500)
      .send({ status: "Failure", message: "can not get vehicles from server" });
  }
};
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleModel.findByIdAndDelete(req.query.id);
    const vehicles = await vehicleModel.find();
    res.status(200).send({ status: "Success", vehicles: vehicles });
    fs.unlink(
      path.join(__dirname, `../../public/${vehicle.vehicleImage}`),
      (res) => {}
    );
  } catch (err) {
    res
      .status(500)
      .send({ status: "Failure", message: "can not get vehicles from server" });
  }
};
exports.getTypesForPricing = async (req, res) => {
  try {
    let id = new ObjectId(req.query.city);
    const vehicleTypes = await vehicleModel.aggregate([...pipeline1]);
    const registeredPricing = await vehiclePricing.aggregate([
      {
        $match: {
          city: id,
        },
      },
      ...pipeline2,
    ]);
    let onlyregisteredTypes = [];
    let availableTypes = [];
    registeredPricing.forEach((element) => {
      onlyregisteredTypes.push(element.vehicleType);
    });
    for (let vehicleType of vehicleTypes) {
      if (onlyregisteredTypes.includes(vehicleType.type)) {
        continue;
      } else {
        availableTypes.push(vehicleType.type);
      }
    }
    res.status(200).send({ status: "Success", availableTypes });
  } catch (err) {
    res.status(500).send({
      status: "Failure",
      message: "can not get vehicle-Types from server",
    });
  }
};
exports.getAllTypes = async (req, res) => {
  try {
    const vehicleTypes = await vehicleModel.aggregate([...pipeline1]);
    let allVehicleTypes = [];
    vehicleTypes.forEach((element) => {
      allVehicleTypes.push(element.type);
    });
    res.status(200).send({ status: "Success", allVehicleTypes });
  } catch (err) {
    res.status(500).send({
      status: "Failure",
      message: "can not get vehicle-Types from server",
    });
  }
};
