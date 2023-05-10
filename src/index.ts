import express from "express";

import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import socketHandler from "./socket.io";
export const app = express();

// Midlleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use((req, res, next) => {
  if (true) {
    console.log("yes");
    console.log(req.url);
  }
  next();
});
//routes

//start server
export const server = require("http").Server(app);
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
