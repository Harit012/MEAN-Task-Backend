const driverModel = require("../../models/driver");
const fs = require("fs");
const { BlockList } = require("net");
const path = require("path");

const driversPerPage = 10;

const pipeline = [
  {
    $lookup: {
      from: "countries",
      localField: "country",
      foreignField: "_id",
      as: "country",
    },
  },
  { $unwind: "$country" },
  {
    $lookup: {
      from: "zones",
      localField: "city",
      foreignField: "_id",
      as: "city",
    },
  },
  { $unwind: "$city" },
  {
    $project: {
      _id: 1,
      driverName: 1,
      driverEmail: 1,
      phone: 1,
      driverProfile: 1,
      countryCode: "$country.countryCallCode",
      countryName: "$country.countryName",
      city: "$city.zoneName",
      approved: 1,
      serviceType: 1,
      isAvailable: 1,
    },
  },
];

exports.getDrivers = async (req, res) => {
  let page = req.query.page;
  const sort = req.query.sort;
  const input = req.query.input;
  try {
    switch (sort) {
      case "none":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel
            .aggregate([...pipeline])
            .skip(page * driversPerPage)
            .limit(driversPerPage);
          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        } else {
          const drivers = await driverModel
            .aggregate([
              {
                $match: {
                  $or: [
                    { driverName: { $regex: input, $options: "i" } },
                    { driverEmail: { $regex: input, $options: "i" } },
                    { phone: { $regex: input, $options: "i" } },
                  ],
                },
              },
              ...pipeline,
            ])
            .skip(page * driversPerPage)
            .limit(driversPerPage);

          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        }
        break;

      case "name":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel
            .aggregate([...pipeline, { $sort: { driverName: 1 } }])
            .skip(page * driversPerPage)
            .limit(driversPerPage);
          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        } else {
          const drivers = await driverModel
            .aggregate([
              {
                $match: {
                  $or: [
                    { driverName: { $regex: input, $options: "i" } },
                    { driverEmail: { $regex: input, $options: "i" } },
                    { phone: { $regex: input, $options: "i" } },
                  ],
                },
              },
              ...pipeline,
              { $sort: { driverName: 1 } },
            ])
            .skip(page * driversPerPage)
            .limit(driversPerPage);
          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        }
        break;

      case "email":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel
            .aggregate([...pipeline, { $sort: { driverEmail: 1 } }])
            .skip(page * driversPerPage)
            .limit(driversPerPage);
          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        } else {
          const drivers = await driverModel
            .aggregate([
              {
                $match: {
                  $or: [
                    { driverName: { $regex: input, $options: "i" } },
                    { driverEmail: { $regex: input, $options: "i" } },
                    { phone: { $regex: input, $options: "i" } },
                  ],
                },
              },
              ...pipeline,
              { $sort: { driverEmail: 1 } },
            ])
            .skip(page * driversPerPage)
            .limit(driversPerPage);
          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        }
        break;

      case "phone":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel
            .aggregate([...pipeline, { $sort: { phone: 1 } }])
            .skip(page * driversPerPage)
            .limit(driversPerPage);
          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        } else {
          const drivers = await driverModel
            .aggregate([
              {
                $match: {
                  $or: [
                    { driverName: { $regex: input, $options: "i" } },
                    { driverEmail: { $regex: input, $options: "i" } },
                    { phone: { $regex: input, $options: "i" } },
                  ],
                },
              },
              ...pipeline,
              { $sort: { phone: 1 } },
            ])
            .skip(page * driversPerPage)
            .limit(driversPerPage);
          if (drivers.length == 0) {
            res
              .status(404)
              .send({ success: false, message: "No Drivers Found" });
          } else {
            res.status(200).send({ success: true, drivers: drivers });
          }
        }
        break;
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not get drivers from server",
    });
  }
};
exports.postDriver = async (req, res) => {
  try {
    let driverProfile = req.file.path;
    driverProfile = driverProfile.slice(6, driverProfile.length);
    const driver = new driverModel({
      driverProfile: driverProfile,
      driverEmail: req.body.driverEmail,
      driverName: req.body.driverName,
      phone: req.body.phone,
      country: req.body.country,
      city: req.body.city,
    });
    await driver.save();
    res.status(201).send({ status: "Success", driver: driver });
  } catch (err) {
    if (req.file) {
      let newpath = req.file.path;
      newpath = newpath.slice(6, newpath.length);
      fs.unlink(path.join(__dirname, `../../public/${newpath}`), (res) => {});
    }
    res.status(500).send({
      status: "Failure",
      message: "can not add driver failure from server",
    });
  }
};
exports.deleteDriver = async (req, res) => {
  try {
    const deleted = await driverModel.findOneAndDelete({ _id: req.query.id });
    fs.unlink(
      path.join(__dirname, `../../public/${deleted.driverProfile}`),
      (res) => {}
    );
    res
      .status(200)
      .send({ success: true, message: "Driver Deleted successfully" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not delete driver from the server",
    });
  }
};

exports.patchDriver = async (req, res) => {
  const id = req.body.id;
  let approvelStatus = req.body.approvel;
  try {
    await driverModel.findByIdAndUpdate(id, {
      approved: approvelStatus,
    });
    res.status(200).send({
      success: true,
      message: "Driver Approvel updated successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not update driver from the server",
    });
  }
};

exports.putDriver = async (req, res) => {
  const data = req.body;
  let newpath = "";
  if (req.file) {
    newpath = req.file.path;
    newpath = newpath.slice(6, newpath.length);
    fs.unlink(
      path.join(__dirname, `../../public/${req.body.driverProfile}`),
      (res) => {}
    );
  } else {
    newpath = req.body.driverProfile;
  }
  try {
    await driverModel.findByIdAndUpdate(
      { _id: data.id },
      {
        driverName: req.body.driverName,
        driverEmail: req.body.driverEmail,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
        driverProfile: newpath,
      }
    );

    res.status(200).send({ success: true, message: "User  Updated !" });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

exports.patchServiceType = async (req, res) => {
  try {
    await driverModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        serviceType: req.body.serviceType,
      }
    );
    res.status(200).send({ success: true, message: "ServiceType Updated" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not update serviceType from the server",
    });
  }
};


