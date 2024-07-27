require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
const cron = require("cron");

const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  optionSuccessStatus: 204,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
const loginRouter = require("./routes/login");
const adminRouter = require("./routes/admin");
const databaseRouter = require("./routes/databaseConnection");

const app = express();
let server = http.createServer(app);

app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

app.set("socketio", io);

// cron connetion

let DriveReaction = 2;

io.on("connection", (socket) => {
  console.log(`✅✅ Socket Id: ${socket.id} ✅✅`);
  io.emit("message", "Hello Socket 👋");

  socket.on("DriverReaction", (data) => {
    if (typeof data.reaction == "number") {
      DriveReaction = data.reaction;
    } else {
      io.emit("Error", "Required Data is not provided :- reaction");
    }
  });

  socket.on("cronDrivers", (data) => {
    if (
      data.drivers &&
      data.type &&
      data.rideId &&
      data.timeOut &&
      data.driverIds
    ) {
      let count = 0;
      let itration = 0;
      let status = "none";
      let DriverList = data.drivers;
      let type = data.type;
      let rideId = data.rideId;
      let waitTime = data.timeOut;
      let DriverIds = data.driverIds;
      let cronJob = new cron.CronJob("*/1 * * * * *", function () {
        let renNo = DriveReaction;
        count++;
        if (renNo == 1) {
          status = "accepted";
          io.emit("Accepted", {
            rideId: rideId,
            status: status,
            driver: DriverList[itration],
            driverId: DriverIds[itration],
            time: count,
            type: type,
            itr: itration,
            totalTime: waitTime,
            totalItr: DriverList.length,
          });
          io.emit("cronStoped",{
            status: status
          })
          cronJob.stop();
          count = 0;
          itration = 0;
          DriveReaction = 2;
        } else if (renNo == 0) {
          status = "rejected";
          io.emit("Rejected", {
            rideId: rideId,
            status: status,
            driver: DriverList[itration],
            driverId: DriverIds[itration],
            time: count,
            type: type,
            itr: itration,
            totalTime: waitTime,
            totalItr: DriverList.length,
          });
          count = 0;
          itration++;
          DriveReaction = 2;

          if (itration > DriverList.length - 1) {
            cronJob.stop();
            io.emit("cronStoped",{
              status: status
            })
          }
        } else {
          if (count >= waitTime) {
            count = 0;
            itration++;
            if (itration > DriverList.length - 1) {
              io.emit("cronStoped",{
                status: status
              });
              cronJob.stop();
              count = 0;
              itration = 0;
            }
          } else if (count == 1) {
            status = "pending";
            io.emit("Pending", {
              rideId: rideId,
              status: status,
              driver: DriverList[itration],
              driverId: DriverIds[itration],
              time: count,
              type: type,
              new: true,
              itr: itration,
              totalTime: waitTime,
              totalItr:DriverList.length

            });
          }
          status = "pending";
          io.emit("Pending", {
            rideId: rideId,
            status: status,
            driver: DriverList[itration],
            driverId: DriverIds[itration],
            time: count,
            type: type,
            new: false,
            itr: itration,
            totalTime: waitTime,
            totalItr:DriverList.length
          });
        }
      });
      cronJob.start();
    } else {
      io.emit("Error", "Required Data is not provided");
    }
  });
});

// to check DATABASE connectivity
app.use("/", databaseRouter);

// routes
app.use("/user", loginRouter);
app.use("/admin", adminRouter);

// wildcard Route
app.use("*", (req, res) => {
  res
    .status(404)
    .send({ code: 404, success: false, message: "Page Not Found" });
});

server.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
});
