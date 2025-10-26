// src/server.ts
import express from "express";
import { connectDB } from "./db";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.get("/", (_req, res) => {
  res.send("🚀 Server is running successfully!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
