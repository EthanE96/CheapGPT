import { ChatGroq } from "@langchain/groq";
import mongoose, { Schema } from "mongoose";

export interface Model extends ChatGroq {
  _id: string;
  modelDisplayName: string;
  modelName: string;
  temperature: number;
  systemPrompt: string;
  maxTokens?: number;
  logo: string;
  createdAt: Date;
  updatedAt?: Date;
}

const modelSchema = new Schema<Model>(
  {
    modelDisplayName: { type: String, required: true },
    modelName: { type: String, required: true },
    temperature: { type: Number, required: true },
    systemPrompt: { type: String, required: true },
    maxTokens: { type: Number },
    logo: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const Model = mongoose.model<Model>("Model", modelSchema);
