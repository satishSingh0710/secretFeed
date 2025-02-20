import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new SocketIOServer(httpServer, {
    path: "/socket.io/", // ✅ Ensure the correct path
    cors: {
      origin: "*", // ✅ Allow all origins
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("joinRoom", (urlId) => {
      socket.join(urlId);
      console.log(`📢 User joined room: ${urlId}`);
    });

    socket.on("newMessage", (data) => {
      io.to(data.urlId).emit("messageReceived", data.message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`🚀 WebSocket server running on http://${hostname}:${port}`);
  });
});
