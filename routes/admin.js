const express = require("express");
const router = express.Router();
const userAuth = require("../controller/authentication/userAuth");
const middlewares = require("../middlewares/login");

const pricingRouter = require("./pricing");
const userRouter = require(".//user");
const driverRouter = require("./driver");
const settingRouter = require("./settings");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: `./public/images`,
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.use("/", middlewares.verificationParamsCheck ,userAuth.getVerifiedUser);

router.use("/pricing", upload.single("vehicleImage"), pricingRouter);

router.use("/users", upload.single("userProfile"), userRouter);

router.use("/drivers", upload.single("driverProfile"), driverRouter);

router.use("/settings", settingRouter);

module.exports = router;
