const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./UserInformation/UserControl.js");
const port = process.env.PORT || 5000;
const router = require("./router");

app.use(router);

io.on("connection", (socket) => {
  console.log("A user login detected");
  socket.on("join", ({ id, passWord, room }) => {
    console.log(
      "Socket ID: " + socket.id,
      "id: " + id,
      "password:" + passWord,
      "room:" + room
    );
    const { error, newUser } = addUser({
      socketId: socket.id,
      id,
      passWord,
      room,
    });

    if (error) console.log(error);

    socket.emit("joinMessage", {
      administrator: `Hop-chat`,
      text: `${newUser.id}, Welcome to the room ${newUser.room}`,
    });
    socket.broadcast
      .to(newUser.room)
      .emit("joinMessage", { text: `${id} joins the room ${room}` });
    socket.join(newUser.room);
  });

  socket.on("sendMessage", (id, message) => {
    const user = getUser(id);
    io.to(user.room).emit("joinMessage", { user: user.id, text: message });
  });

  socket.on("disconnect", () => {
    console.log("User Left!");
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
