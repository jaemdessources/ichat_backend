import { Socket } from "socket.io";
import { Message } from "./models";

const io = require("socket.io")(5000);

io.on("connection", (socket: Socket) => {
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

// io.listen(5000);
