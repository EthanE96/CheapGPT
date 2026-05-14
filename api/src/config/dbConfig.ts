import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async (mongoURI: string, dbName?: string) => {
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(mongoURI, {
      tls: true,
      retryWrites: false,
      ...(dbName && { dbName }),
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
