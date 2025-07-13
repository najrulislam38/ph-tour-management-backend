import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the PH Tour Management Application",
  });
});

export default app;
