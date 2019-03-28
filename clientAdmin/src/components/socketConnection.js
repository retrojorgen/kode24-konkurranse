import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:5000");
function adminHandshake(authCode) {
  //socket.on("timer", timestamp => cb(null, timestamp));
  socket.emit("admin handshake", authCode);
}

function getAdminList(cb) {
  socket.on("admin user list", list => cb(list));
}

function getEvents(cb) {
  socket.on("admin events", list => cb(list));
}

function getCommands(cb) {
  socket.on("admin typed command", list => cb(list));
}

function getFileSystemUsernamePassword(cb) {
  socket.on("admin typed filesystem username password", list => cb(list));
}

export {
  adminHandshake,
  getAdminList,
  getCommands,
  getFileSystemUsernamePassword,
  getEvents
};
