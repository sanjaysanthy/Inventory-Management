import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

// CORS CONFIGURATION
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stocksync-iota.vercel.app",
      "https://stocksync-inventory-management-04el.onrender.com",
      "https://inventory-management-frontend-9rel.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MIDDLEWARE
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API running successfully");
});

// API ROUTES
app.use("/api", routes);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`[Error]: ${err.message}`);

  res.status(statusCode).json({
    message: err.message,
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
});

// DATABASE CONNECTION
const PORT = process.env.PORT || 8082;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "❌ Error: MONGODB_URI is not defined in .env file"
  );
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(
        `🚀 Server is running on PORT: ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error(
      "❌ MongoDB Connection Failed:",
      err.message
    );

    process.exit(1);
  });