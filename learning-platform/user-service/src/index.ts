import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("combined"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/v1/auth", limiter);

app.use("/api/v1", routes);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "user-service" }));

async function start(): Promise<void> {
  await mongoose.connect(config.mongoUri);
  console.log("MongoDB connected");
  app.listen(config.port, () => {
    console.log(`User service listening on port ${config.port}`);
  });
}

start().catch(console.error);
