require("dotenv").config({ path: __dirname + "/.env" });
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
var multer = require("multer");

const loginRouter = require("./routes/login");
const adminPricingRouter = require("./routes/adminPricing");
const jwt = require("../AngularBackend/controller/jwtOperations");
const { varifyToken } = require("../AngularBackend/controller/jwtOperations");
const { log } = require("console");

var app = express();

try {
  mongoose.connect("mongodb://localhost:27017/angularbackend");
  log("Database connected");
} catch (err) {
  log(err);
}

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, cb) => {
    console.log(req.file);
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", loginRouter);
app.use("/admin", loginRouter);

app.use("/admin/pricing", upload.single("vehicleImage"), adminPricingRouter);

app.use(function (err, req, res, next) {});

module.exports = app;
