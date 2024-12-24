import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  const env = process.env.ENV as string;
  let mongoURI = "none";

  if (env == "PRD") {
    mongoURI = process.env.MONGODB_URI_PRD as string;
  } else if (env == "STAGE") {
    mongoURI = process.env.MONGODB_URI_STAGE as string;
  } else {
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
