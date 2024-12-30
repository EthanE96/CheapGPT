import mongoose, { Schema } from "mongoose";

export interface Chat {
  _id: string;
  userId: string;
  message?: Message[];
  model: string;
  apiKey: string;
  title: string;
  totalTokens?: Tokens;
  totalCost?: number;
}

export interface Message {
  content: string;
  isUser: boolean;
  tokens?: Tokens;
  cost?: number;
  date?: Date;
}

export interface Tokens {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

const chatSchema = new Schema<Chat>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    message: [
      {
        content: { type: String, required: true },
        isUser: { type: Boolean, required: true },
        tokens: {
          _id: false,
          totalTokens: { type: Number },
          promptTokens: { type: Number },
          completionTokens: { type: Number },
        },
        cost: { type: Number },
        date: { type: Date, default: Date.now },
      },
    ],
    model: { type: String, required: true },
    apiKey: { type: String, required: true },
    title: { type: String, required: true, default: "New Chat" },
    totalTokens: {
      _id: false,
      totalTokens: { type: Number },
      promptTokens: { type: Number },
      completionTokens: { type: Number },
    },
    totalCost: { type: Number },
  },
  {
    timestamps: true, // Automatically handle `createdAt` and `updatedAt` fields
  }
);

export const Chat = mongoose.model<Chat>("Chat", chatSchema);
