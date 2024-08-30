const { CronJob } = require("cron");
const rideModel = require("./models/ride");
const driverModel = require("./models/driver");
const settingsModel = require("./models/settings");
const queries = require("./Database Operations/rides/confirmRides");
const { ObjectId } = require("mongodb");

const job = new CronJob(
  "*/1 * * * * *",
  async () => {
    try {
      let time = await getSettingsTime();
      let rides = await getRidesToAssign();
      if (rides.length > 0) {
        rides.forEach(async (element) => {
          // timeOut condition
          let timeTaken = Math.floor((Date.now() - element.timeOfAssign) / 1000);
          if (timeTaken == time+1) {
            await driverModel.findOneAndUpdate(
              { _id: element.driverId },
              { $set: { isAvailable: true } },
              { new: true }
            );
            global.io.emit("Rejected", { rideId: element._id });
          }
          global.io.emit("remainingTime", {
            seconds:
              time - Math.floor((Date.now() - element.timeOfAssign) / 1000),
            rideId: element._id,
          });
          // runtime rejection & reAssignment
          if (
            element.status == "assignedToAny" &&
            (element.blockList.length == 0 ||
              Math.floor((Date.now() - element.timeOfAssign) / 1000) > time ||
              element.AcceptanceStatus == 0)
          ) {
            // finding Available Drivers
            let availableDrivers = await queries.fetchAvailableDrivers(
              element.serviceType,
              element.sourceCity,
              element.blockList,
              "forAuto"
            );
            if (availableDrivers.length > 0) {
              let availableRightNow = availableDrivers.filter(
                (driver) => driver.isAvailable
              );
              if (availableRightNow.length > 0) {
                let driverId = availableRightNow[0]._id;
                await queries.assignRideToDriver(element._id, driverId);

                let assignedRide = await queries.getRideInFormatedMannenr(
                  element._id
                );
                global.io.emit("assignRideFromServer", assignedRide);
                // return;
              } else {
                global.io.emit("requestOnHold", element._id);
              }
            } else {
              await queries.updateRideStatus(element._id, "available");
              global.io.emit("cronEnd", {
                message: "All Drivers are Busy",
                rideId: element._id,
              });
              return;
            }
          } else if (
            element.status == "assignedToOne" &&
            (element.blockList.length > 1 ||
              Math.floor((Date.now() - element.timeOfAssign) / 1000) > time ||
              element.AcceptanceStatus == 0)
          ) {
            await queries.updateRideStatus(element._id, "available");
            global.io.emit("cronEnd", {
              message: "All Drivers are Busy",
              rideId: element._id,
            });
          }
        });
      }
    } catch (err) {
      console.error("network Error");
    }
  },
  null,
  true,
  "Asia/Kolkata"
);
const getRidesToAssign = async () => {
  try {
    const availableRidesToAssign = await rideModel.aggregate([
      {
        $match: {
          $or: [
            { status: { $eq: "assignedToAny" } },
            { status: { $eq: "assignedToOne" } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          serviceType: 1,
          sourceCity: 1,
          blockList: 1,
          status: 1,
          timeOfAssign: 1,
          AcceptanceStatus: 1,
          driverId: 1,
        },
      },
    ]);
    return availableRidesToAssign;
  } catch (error) {
    console.error("Error in async task:", error);
  }
};

const getSettingsTime = async () => {
  try {
    let settings = await settingsModel.aggregate([
      { $match: { _id: new ObjectId("665e91b8e54b312a06e372b6") } },
      { $project: { timeOut: 1 } },
    ]);
    return settings[0].timeOut;
  } catch (err) {
    console.error("Error in async task:", err);
  }
};

module.exports = { job };
