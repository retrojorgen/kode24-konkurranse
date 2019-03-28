import socketIOClient from "socket.io-client";
const socket = socketIOClient("https://paaske2019.kode24.no");
function submitCommand(command) {
  //socket.on("timer", timestamp => cb(null, timestamp));
  socket.emit("typed command", command);
}
function submitFileSystemUsernameAndPassword(username, password) {
  //socket.on("timer", timestamp => cb(null, timestamp));
  socket.emit("typed filesystem username password", {
    username: username,
    password: password
  });
}
export { submitCommand, submitFileSystemUsernameAndPassword };
