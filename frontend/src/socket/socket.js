import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Socket Connected");
});

export default socket;