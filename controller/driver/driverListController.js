const driverModel = require("../../models/driver");
const fs = require("fs");
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
      serviceType:1
    },
  },
];

exports.getDrivers = async (req, res) => {
  const page = req.query.page;
  const sort = req.query.sort;
  const input = req.query.input;
  try {
    switch (sort) {
      case "none":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel.aggregate([...pipeline]);
          res.send({ drivers: drivers });
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
          res.send({ drivers: drivers });
        }
        break;

      case "name":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel.aggregate([
            ...pipeline,
            { $sort: { driverName: 1 } },
          ]);
          res.send({ drivers: drivers });
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
          res.send({ drivers: drivers });
        }
        break;

      case "email":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel.aggregate([
            ...pipeline,
            { $sort: { driverEmail: 1 } },
          ]);
          res.send({ drivers: drivers });
        } else {
          const drivers = await driverModel.aggregate([
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
          ]);
          res
            .send({ drivers: drivers })
            .skip(page * driversPerPage)
            .limit(driversPerPage);
        }
        break;

      case "phone":
        if (input == "ThereIsNothing") {
          const drivers = await driverModel.aggregate([
            ...pipeline,
            { $sort: { phone: 1 } },
          ]);
          res.send({ drivers: drivers });
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
          res.send({ drivers: drivers });
        }
        break;
    }
  } catch (err) {
    res.send({ error: err.message });
  }
};
exports.postDriver = async (req, res) => {
  if (
    req.body.driverName ||
    req.body.driverEmail ||
    req.body.phone ||
    req.body.country ||
    req.body.city ||
    req.file
  ) {
    try {
      let driverProfile = req.file.path;
      driverProfile = driverProfile.slice(6, driverProfile.length);
      console.log(driverProfile);
      const driver = new driverModel({
        driverProfile: driverProfile,
        driverEmail: req.body.driverEmail,
        driverName: req.body.driverName,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
      });
      await driver.save();
      res.send({ driver: driver });
    } catch (err) {
      res.send({ error: err.message });
    }
  } else {
    res.send({ error: "Please enter all the fields" });
  }
};

exports.deleteDriver = async (req, res) => {
  if (req.query.id) {
    try {
      const deleted = await driverModel.findOneAndDelete({ _id: req.query.id });
      fs.unlink(
        path.join(__dirname, `../../public/${deleted.driverProfile}`),
        (res) => {}
      );
      res.send({ message: "Driver Deleted successfully" });
    } catch (err) {
      res.send({ error: err.message });
    }
  } else {
    res.send({ error: "Please Provide Id" });
  }
};

exports.patchDriver = async (req, res) => {
  const id = req.body.id;
  let approvelStatus = req.body.approvel;
  try {
    await driverModel.findByIdAndUpdate(id, {
      approved: approvelStatus,
    });
    res.send({ message: "Driver updated successfully" });
  } catch (err) {
    res.send(err.message);
  }
};

exports.putDriver = async (req, res) => {
  const data = req.body;
  if (req.file) {
    var newpath = req.file.path;
    newpath = newpath.slice(6, newpath.length);
    fs.unlink(
      path.join(__dirname, `../../public/${req.body.driverProfile}`),
      (res) => {}
    );
  } else {
    var newPath = req.body.driverProfile;
  }
  try {
    await driverModel.findByIdAndUpdate({_id:data.id},{
      driverName:req.body.driverName,
      driverEmail:req.body.driverEmail,
      phone:req.body.phone,
      country:req.body.country,
      city:req.body.city,
      driverProfile:newpath
    })

    res.send({message:"User  Updated !"})
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.patchServiceType = async(req,res)=>{
  try{
    await driverModel.findOneAndUpdate({_id:req.body.id},{
      serviceType:req.body.serviceType
    })
    res.send({message:"ServiceType Updated"})
  }
  catch(err){
    res.send({error:err.message})
  }
}