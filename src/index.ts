import { Server, Socket } from "socket.io";
import { Message } from "./models";
import http from "http";
import express from "express";
import axios from "../lib/axios";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import { verifyAccessToken } from "./utils/jwt";

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
  const {
    query: { roomId },
    auth: { token },
    headers: { origin },
  } = socket.handshake;

  process.env.NODE_ENV !== "production" && console.log("joinged room ", roomId);
  //each room contains all the clients where
  //one user is connected
  try {
    verifyAccessToken(token);
    socket.join(roomId as string);
    socket.on("send-message", (message: Message & { recipients: string[] }) => {
      //for each recipients send the message to their room
      process.env.NODE_ENV !== "production" && console.log(message.recipients);
      message.recipients.forEach((id) =>
        socket.to(id).emit("receive-message", message)
      );

      delete message.recipients;
      console.log(socket.handshake.headers);
      axios.post(
        `${origin}/api/messages`,
        { message },
        { headers: { cookie: `accessToken=${token}` } }
      );
    });
  } catch (err) {
    socket.disconnect();
    process.env.NODE_ENV !== "production" && console.log(err);
  }
});

server.listen(PORT, () => {
  console.log("listening on port", PORT);
});
