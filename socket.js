"use client";

import { io } from "socket.io-client";

export const socket = io("https://secretfeed.onrender.com", {
    path: "/socket.io/", // ✅ Ensure it matches the server path
    transports: ["websocket", "polling"], // ✅ Forces WebSocket transport
  });
  