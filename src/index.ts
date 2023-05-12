import { Server, Socket } from "socket.io";
import { Message } from "./models";
import http from "http";
import express from "express";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const app = express();
app.use(cors({ origin: [/\.vercel\.app$/, "http://localhost:3000"] }));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: [/\.vercel\.app$/, "http://localhost:3000"] },
});
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.write(`<h1>Socket.io start on Port: ${PORT}</h1>`);
  res.end();
});

io.on("connection", (socket: Socket) => {
  console.dir(socket.handshake.headers.origin);
  const roomId = socket.handshake.query.roomId;
  process.env.NODE_ENV !== "production" && console.log("joinged room ", roomId);
  //each room contains all the clients where
  //one user is connected
  socket.join(roomId as string);
  socket.on("send-message", (data: Message & { recipients: string[] }) => {
    //for each recipients send the message to their room
    process.env.NODE_ENV !== "production" && console.log(data.recipients);
    data.recipients.forEach((id) =>
      socket.to(id).emit("receive-message", { ...data, recipients: [] })
    );
  });
});

server.listen(PORT, () => {
  console.log("listening on port", PORT);
});
