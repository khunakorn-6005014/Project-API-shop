//APIproject/config/db.config.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log("MongoDB URL:", process.env.MONGO_URI);
console.log("JWT Secret:", process.env.JWT_SECRET);
export const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connection Successful");
    mongoose.connection.on("open", () => {
            console.log("✅ MongoDB is fully connected.");
        });
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    console.log("MongoDB URL:", process.env.MONGO_URI);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};