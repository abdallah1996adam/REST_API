const express = require("express");
require('dotenv').config();
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routers");
const { request, response } = require("express");

const server = express();

server.use(cors());
server.use(morgan("dev"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(router);
//to handle 404 errors
server.all("*", (request, response) => {
  response.status(404).send({ message: "page is not found" });
});

server.listen(process.env.PORT, () => {
  console.log(`server is up and running on port ${process.env.PORT}`);
});
