import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  await mongoose.connect(env.MONGODB_URI);
  console.log(`✓ MongoDB connected (${mongoose.connection.name})`);
}
