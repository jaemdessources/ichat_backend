"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io = require("socket.io")(5000);
io.on("connection", (socket) => {
    const roomId = socket.handshake.query.roomId;
    process.env.NODE_ENV !== "production" && console.log("joinged room ", roomId);
    //each room contains all the clients where
    //one user is connected
    socket.join(roomId);
    socket.on("send-message", (data) => {
        //for each recipients send the message to their room
        process.env.NODE_ENV !== "production" && console.log(data.recipients);
        data.recipients.forEach((id) => socket.to(id).emit("receive-message", Object.assign(Object.assign({}, data), { recipients: [] })));
    });
});
// io.listen(5000);
//# sourceMappingURL=index.js.map