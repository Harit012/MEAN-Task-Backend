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
      customerId: 1,
    },
  },
];

exports.getUser = async (req, res) => {
  let page = req.query.page;
  let input = req.query.input;
  let sort = req.query.sort;
  try {
    switch (sort) {
      case "none":
        if (input == "ThereIsNothing") {
          const users = await userModel
            .aggregate([...pipeline])
            .skip(page * userPerPage)
            .limit(userPerPage);
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
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
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
        }
        break;

      case "name":
        if (input == "ThereIsNothing") {
          const users = await userModel
            .aggregate([...pipeline, { $sort: { userName: 1 } }])
            .skip(page * userPerPage)
            .limit(userPerPage);
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
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
              },
            ])
            .skip(page * userPerPage)
            .limit(userPerPage);
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
        }
        break;

      case "email":
        if (input == "ThereIsNothing") {
          const users = await userModel
            .aggregate([...pipeline, { $sort: { email: 1 } }])
            .skip(page * userPerPage)
            .limit(userPerPage);
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
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
              },
            ])
            .skip(page * userPerPage)
            .limit(userPerPage);
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
        }
        break;

      case "phone":
        if (input == "ThereIsNothing") {
          const users = await userModel
            .aggregate([...pipeline, { $sort: { phone: 1 } }])
            .skip(page * userPerPage)
            .limit(userPerPage);
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
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
              },
            ])
            .skip(page * userPerPage)
            .limit(userPerPage);
          if (users.length == 0) {
            res.status(404).send({ success: false, message: "No Users Found" });
          } else {
            res.status(200).send({ success: true, users: users });
          }
        }
        break;
    }
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not get user from server" });
  }
};

exports.postUser = async (req, res) => {
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
    res.status(200).send({ success: true, user: newUser });
  } catch (err) {
    fs.unlink(path.join(__dirname, `../../public/${file}`), (res) => {});
    res
      .status(500)
      .send({ success: false, message: "can not Add user in Servere" });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.query.id;
  const customerId = req.query.customerId;
  try {
    await stripe.customers.del(customerId);

    let deletedUser = await userModel.findOneAndDelete({ _id: id });
    fs.unlink(
      path.join(__dirname, `../../public/${deletedUser.userProfile}`),
      (res) => {}
    );
    res
      .status(200)
      .send({ success: true, message: "user Deleted successfully" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "can not delete user from the server",
    });
  }
};

exports.putUser = async (req, res) => {
  let data = req.body;
  let id = req.body.id;
  let newpath = "";
  if (req.file) {
    newpath = req.file.path;
    newpath = newpath.slice(6, newpath.length);
    fs.unlink(
      path.join(__dirname, `../../public/${req.body.olduserProfile}`),
      (res) => {}
    );
  } else {
    newpath = req.body.olduserProfile;
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
    res
      .status(200)
      .send({ success: true, message: "User Updated Successfully" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "can not update from server" });
  }
};
