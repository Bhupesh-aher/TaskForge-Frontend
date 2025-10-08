import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // same as your backend
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});
