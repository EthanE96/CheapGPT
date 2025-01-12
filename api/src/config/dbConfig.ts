import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  const env = process.env.ENV as string;
  let mongoURI = "none";

  switch (env) {
    case "PROD":
      mongoURI = process.env.MONGODB_URI_PROD as string;
      break;
    case "DEV":
      mongoURI = process.env.MONGODB_URI_DEV as string;
      break;
    default:
      console.error(`Invalid ENV: ${env}`);
      process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
