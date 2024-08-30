require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
const { job } = require('./cron');


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
const dataBase = require("./routes/databaseConnection");

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

global.io = io;

io.on("connection", (socket) => {
  console.log(`✅✅ Socket Id: ${socket.id} ✅✅`);
  // console.log(socket)
  io.emit("message", "Hello Socket 👋");

  exports.emitEventTOIo = ( event, data)=>{
    io.emit(event, data);
  }

  exports.emitEventToSocket = (event, data) => {
    socket.emit(event, data);
  };
  
});

// to check DATABASE connectivity
dataBase.connection();

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
