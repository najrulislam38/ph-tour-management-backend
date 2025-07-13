/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVariables } from "./config/env";

let server: Server;

const startServer = async () => {
  try {
    const mongoUrl = envVariables.DB_URL;
    const port = envVariables.PORT;

    if (!mongoUrl) {
      throw new Error("DB_URL environment variable is not defined.");
    }
    await mongoose.connect(mongoUrl);

    console.log("Connected to Database.");

    server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down.", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(
    "uncaught Exception error detected... Server shutting down.",
    err
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// sigterm signal // signal from cloud companies like AWS, Vercel
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down.");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// sigint signal // signal from ctrl + c
process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down.");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// unhandled rejection error example
// Promise.reject(
//   new Error("I forgot to catch this promise within try catch block.")
// );

//uncaught exception error example
// throw new Error("I forgot to handle this error");

/**
 * unhandled rejection error.
 * uncaught rejection/exception error.
 * sigterm signal error
 */
