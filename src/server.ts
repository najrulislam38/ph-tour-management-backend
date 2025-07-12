import { Server } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

let server: Server;

dotenv.config();

const startServer = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    const port = process.env.PORT;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL environment variable is not defined.");
    }
    await mongoose.connect(mongoUrl);

    console.log("Connected to Database.");

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
