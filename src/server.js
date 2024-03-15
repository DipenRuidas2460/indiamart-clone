const express = require("express");
const upload = require("express-fileupload");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const nocache = require("nocache");

app.use(nocache());
app.use(cors());
app.use(upload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials"
  );
  next();
});

const unSecureRoutes = require("./routes/unsecureRoute");
const secureRoutes = require("./routes/secureRoutes");
const { validateTokenMiddleware } = require("./middleware/auth");

app.use("/api", unSecureRoutes);
app.use("/api", validateTokenMiddleware, secureRoutes);

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`Server is connected at port ${process.env.APP_PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRN_HOST,
  },
});

io.on("connection", (socket) => {
  // -------------------------------- for One-to-one-chat ---------------------------------------------

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", ({ room }) => {
    socket.join(room);
  });

  socket.on("typing", ({ room, sender, receiver }) => {
    io.to(room).emit("typing", {
      room: room,
      sender: sender,
      receiver: receiver,
    });
  });

  socket.on("stop typing", ({ room, sender, receiver }) => {
    io.to(room).emit("stop typing", {
      room: room,
      sender: sender,
      receiver: receiver,
    });
  });

  socket.on("new message", ({ data, room, sender, receiver }) => {
    if (data.msg.personId === data.senderId) return;

    socket.in(data.msg.personId).emit("notification", { data: data });

    io.to(room).emit("message recieved", {
      data: data,
      room: room,
      sender: sender,
      receiver: receiver,
    });
  });

  socket.off("setoff", (userData) => {
    socket.leave(userData.id);
  });
});
