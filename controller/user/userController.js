const userModel = require("../../models/user");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const userPerPage = 10;

const pipeline = [
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
      customerId:1
    },
  },
];

exports.getUser = async (req, res) => {
  if (req.query.input && req.query.page && req.query.sort) {
    let page = req.query.page;
    var input = req.query.input;
    let sort = req.query.sort;
  try {
      switch(sort){
        case "none":
          if (input == "ThereIsNothing") {
            const users = await userModel
              .aggregate([...pipeline ])
              .skip(page * userPerPage)
              .limit(userPerPage);
              res.status(200).send({status:"Success", users: users });
          } else {
            const users = await userModel
              .aggregate([
                {
                  $match: {
                    $or: [
                      { userName: { $regex: input, $options: "i" } },
                      { userEmail: { $regex: input, $options: "i" } },
                      { phone: { $regex: input, $options: "i" } },
                    ],
                  },
                },
                ...pipeline,  
              ])
              .skip(page * userPerPage)
              .limit(userPerPage);
              res.status(200).send({status:"Success", users: users });
          }
          break;

        case "name":
          if (input == "ThereIsNothing") {
            const users = await userModel
              .aggregate([...pipeline, { $sort: { userName: 1 } }])
              .skip(page * userPerPage)
              .limit(userPerPage);
              res.status(200).send({status:"Success", users: users });
          } else {
            const users = await userModel
              .aggregate([
                {
                  $match: {
                    $or: [
                      { userName: { $regex: input, $options: "i" } },
                      { userEmail: { $regex: input, $options: "i" } },
                      { phone: { $regex: input, $options: "i" } },
                    ],
                  },
                },
                ...pipeline,
                {
                  $sort: { userName: 1 },
                }
              ])
              .skip(page * userPerPage)
              .limit(userPerPage);
              res.status(200).send({status:"Success", users: users });
          }
          break;

        case "email":
          if (input == "ThereIsNothing") {
            const users = await userModel
              .aggregate([...pipeline, { $sort: { email: 1 } }])
              .skip(page * userPerPage)
              .limit(userPerPage);
              res.status(200).send({status:"Success", users: users });
          } else {
            const users = await userModel
              .aggregate([
                {
                  $match: {
                    $or: [
                      { userName: { $regex: input, $options: "i" } },
                      { userEmail: { $regex: input, $options: "i" } },
                      { phone: { $regex: input, $options: "i" } },
                    ],
                  },
                },
                ...pipeline,
                {
                  $sort: { email: 1 },
                }
              ])
              .skip(page * userPerPage)
              .limit(userPerPage);
              res.status(200).send({status:"Success", users: users });
          }
          break;
       
        case "phone":
          if (input == "ThereIsNothing") {
            const users = await userModel
              .aggregate([...pipeline, { $sort: { phone: 1 } }])
              .skip(page * userPerPage)
              .limit(userPerPage);
              res.status(200).send({status:"Success", users: users });
          } else {
            const users = await userModel
              .aggregate([
                {
                  $match: {
                    $or: [
                      { userName: { $regex: input, $options: "i" } },
                      { userEmail: { $regex: input, $options: "i" } },
                      { phone: { $regex: input, $options: "i" } },
                    ],
                  },
                },
                ...pipeline,
                {
                  $sort: { phone: 1 },
                }
              ])
              .skip(page * userPerPage)
              .limit(userPerPage);
            res.status(200).send({status:"Success", users: users });
          }
          break;
      }
    } catch (err) {
      res.status(500).send({status:"Failure" , message: "can not get user from server" });
    }
  }
  else {
    res.status(400).send({status:"Failure", message: "page/input/sort Somthing is not Provides" });
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
      const customer = await stripe.customers.create({
        name: req.body.userName,
        email: req.body.email,
      });
      const newUser = new userModel({
        customerId: customer.id,
        userName: req.body.userName,
        userEmail: req.body.email,
        country: req.body.country,
        phone: req.body.phone,
        userProfile: file,
      });
      await newUser.save();
      res.status(200).send({status:"Success", user: newUser });
    } catch (err) {
      res.status(500).send({status:"Failure", message:"can not Add user in Servere" });
    }
  } else {
    fs.unlink(
      path.join(__dirname, `../../public/${file}`),
      (res) => {}
    );
    res.status(400).send({status:"Failure", message: "Not all fields are provided." });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.query.id;
  const customerId = req.query.customerId;  
  if (id && customerId) {
    try {
      const deleted = await stripe.customers.del(customerId);

      let deletedUser = await userModel.findOneAndDelete({ _id: id });
      fs.unlink(
        path.join(__dirname, `../../public/${deletedUser.userProfile}`),
        (res) => {}
      );
      res.status(200).send({status:"Success", message: "user Deleted successfully" });
    } catch (err) {
      res.status(500).send({status:"Failure", message: "can not delete user from the server" });
    }
  }
  else{
    res.status(400).send({status:"Failure", message: "Id or customerId is not Provided" });
  }
};

exports.putUser = async (req, res) => {
  var data = req.body;
  var id = req.body.id;
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
    res.status(200).send({status:"Success", message: "User Updated Successfully" });
  } catch (err) {
    res.status(500).send({status:"Failure", message: "can not update from server" });
  }
};
