import express from "express";
import routes from "./routes";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();

    mongoose.connect(
      "mongodb+srv://tamireshc:ta191087@devhouse.jucbh.mongodb.net/devhouse?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }

  middlewares() {
    this.server.use(cors());

    this.server.use(express.json());

    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "uploads"))
    );
  }
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
