// src/db.ts
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      "mongodb+srv://bora1132004:Ganesh1907@cluster0.a93zhxx.mongodb.net/myDatabaseName?retryWrites=true&w=majority"
    );
    console.log("✅ MongoDB connected successfully");

  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
