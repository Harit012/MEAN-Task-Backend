require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const loginRouter = require("./routes/login");
const adminRouter = require("./routes/admin");
const databaseRouter = require("./routes/databaseConnection");

const app = express();

app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// to check DATABASE connectivity
app.use('/',databaseRouter);

// routes
app.use("/user", loginRouter);
app.use("/admin", adminRouter);

// wildcard Route
app.use("*", (req, res) => {
  res.status(404).send({code:404,success:false,message:"Page Not Found"});
})

app.listen(PORT,async () => {
  console.log(`Server is listening on port ${PORT}`);
});

