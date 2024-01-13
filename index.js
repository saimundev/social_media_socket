import { Server } from "socket.io";

const io = new Server({
  cors: "https://friendzon.vercel.app/",
});

const port = process.env.PORT || 5000;

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  //add user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUser", users);
  });

  //send and get message
  socket.on("sendMessage", (message) => {
    const user = users.find((user) => user.userId === message.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  //disconnect user
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUser", users);
  });
});

io.listen(port, () => {
  console.log("socket server runing");
});
