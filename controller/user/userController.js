const userModel = require("../../models/user");
const fs = require("fs");
const path = require("path");

const ObjectId = require("mongodb").ObjectId;

const userPerPage = 10;

const pipeline1 = [
  {
    $lookup: {
      from: "countries",
      localField: "country",
      foreignField: "_id",
      as: "country",
    },
  },
  {
    $unwind: "$country",
  },
  {
    $lookup: {
      from: "cards",
      localField: "cards",
      foreignField: "_id",
      as: "cards",
    },
  },
  { $unwind: "$cards" },
  {
    $project: {
      _id: 1,
      userName: 1,
      email: "$userEmail",
      countryCode: "$country.countryCallCode",
      phone: 1,
      userProfile: 1,
      cards: 1,
    },
  },
];

const pipeline2 = [
  {
    $lookup: {
      from: "countries",
      localField: "country",
      foreignField: "_id",
      as: "country",
    },
  },
  {
    $unwind: "$country",
  },
  {
    $project: {
      _id: 1,
      userName: 1,
      email: "$userEmail",
      countryCode: "$country.countryCallCode",
      countryName: "$country.countryName",
      phone: 1,
      userProfile: 1,
      cards: 1,
    },
  },
];

exports.getUser = async (req, res) => {
  try {
    if (req.query.input && req.query.page) {
      let page = req.query.page;
      var input = req.query.input;
      var numinput = Number(input);
      if (input == "ThereIsNothing") {
        const users = await userModel
          .aggregate([...pipeline2])
          .skip(page * userPerPage)
          .limit(userPerPage);
        res.send({ users: users });
      } else {
        const users = await userModel
          .aggregate([
            {
              $match: {
                $or: [
                  { userName: { $regex: input, $options: "i" } },
                  { userEmail: { $regex: input, $options: "i" } },
                  // { phone: { $regex: numinput, $options: "i" } },
                ],
              },
            },
            ...pipeline2,
          ])
          .skip(page * userPerPage)
          .limit(userPerPage);
        res.send({ users: users });
      }
    } else {
      res.send({ error: "Please provide search Input" });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
};

exports.postUser = async (req, res) => {
  if (
    req.body.userName ||
    req.body.email ||
    req.body.country ||
    req.body.phone ||
    req.file.path
  ) {
    try {
      let file = req.file.path;
      file = file.slice(6, file.length);
      const newUser = new userModel({
        userName: req.body.userName,
        userEmail: req.body.email,
        country: req.body.country,
        phone: req.body.phone,
        userProfile: file,
      });

      await newUser.save();
      res.send({ user: newUser });
    } catch (err) {
      console.log(err.message);
    }
  } else {
    res.send({ error: "Not all fields are provided." });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.query.id;
  if (id) {
    try {
      let deletedUser = await userModel.findOneAndDelete({ _id: id });
      fs.unlink(
        path.join(__dirname, `../../public/${deletedUser.userProfile}`),
        (res) => {}
      );
      res.send({ message: "user Deleted successfully" });
    } catch (err) {
      console.log(err);
      res.send({ error: err.message });
    }
  }
};

exports.putUser = async (req, res) => {
  const data = req.body;
  const id = req.body.id;
  if (req.file) {
    var newpath = req.file.path;
    newpath = newpath.slice(6, newpath.length);
    fs.unlink(
      path.join(__dirname, `../../public/${req.body.olduserProfile}`),
      (res) => {}
    );
  } else {
    var newpath = req.body.olduserProfile;
  }
  try {
    await userModel.findOneAndUpdate(
      { _id: id },
      {
        userName: data.userName,
        userEmail: data.email,
        country: data.country,
        phone: data.phone,
        userProfile: newpath,
      }
    );
    res.send({ message: "User Updated Successfully" });
  } catch (err) {
    res.send({ error: err.message });
  }
};
