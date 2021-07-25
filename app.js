const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`server on port ${PORT}`));
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConnected = new Set();
io.on("connection", onConnected);

function onConnected(socket) {
  socketsConnected.add(socket.id);

  io.emit("total-client", socketsConnected.size);

  socket.on("onSend", (data) => {
    socket.broadcast.emit("received-message", data);
  });
  
  socket.on("onFeedback", (data) => {
    socket.broadcast.emit("received-feedback", data);
  });
  
  socket.on("disconnect", () => {
    socketsConnected.delete(socket.id);
  });
}
