"use client";

import { io } from "socket.io-client";

export const socket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL?.replace("http", "ws") || "ws://localhost:3001",
    {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
      secure: true
    }
  );
  