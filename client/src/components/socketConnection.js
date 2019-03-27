import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:5000");
function submitCommand(command) {
  //socket.on("timer", timestamp => cb(null, timestamp));
  socket.emit("typed command", command);
}
export { submitCommand };
