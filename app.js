require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3001;

const loginRouter = require("./routes/login");
const adminRouter = require("./routes/admin");
const databaseRouter = require("./routes/databaseConnection");
// const socketController = require("./controller/rides/confirmed-ride")

const app = express();
let server = http.createServer(app);


app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",  
  },
})

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log(`✅✅ Socket Id: ${socket.id} ✅✅`);
  io.emit("message", "Hello Socket 👋");
})

// to check DATABASE connectivity
app.use('/',databaseRouter);

// routes
app.use("/user", loginRouter);
app.use("/admin", adminRouter);

// wildcard Route
app.use("*", (req, res) => {
  res.status(404).send({code:404,success:false,message:"Page Not Found"});
})

server.listen(PORT,async () => {
  console.log(`Server is listening on port ${PORT}`);
});

