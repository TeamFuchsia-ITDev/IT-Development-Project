import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? [process.env.PRODUCTION_ORIGIN] : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("join", (room, username) => {
    socket.join(room);
    socket.username = username;
    io.to(room).emit("message", `${socket.username} has joined the room.`);
  });

  socket.on("roomMessage", (room, message) => {
    io.to(room).emit("message", `${socket.username}: ${message}`);
  });

  // Listen for typing events
  socket.on("typing", (room, username) => {
    socket.to(room).emit("typing", username);
  });

  // Listen for stop-typing events
  socket.on("stopTyping", (room, username) => {
    socket.to(room).emit("stopTyping", username);
  });

  socket.on("disconnect", () => {
    io.emit("message", `User ${socket.username} has left the chat.`);
  });
});

export default async (req, res) => {
	if (req.method === 'GET') {
	  // You can handle GET requests if needed
	  res.status(200).send('WebSocket server is running.');
	} else {
	  // For WebSocket connections, delegate to httpServer
	  await httpServer(req, res);
	}
  };


// httpServer.listen(3001, () => console.log("listening on port 3001"));
