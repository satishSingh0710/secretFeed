"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
    path: "/socket.io/", // ✅ Ensure it matches the server path
    transports: ["websocket", "polling"], // ✅ Forces WebSocket transport
  });
  