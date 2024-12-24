import mongoose, { Schema } from "mongoose";

export interface Chat {
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

const chatSchema = new Schema<Chat>({
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
});

export const Chat = mongoose.model<Chat>("Chat", chatSchema);
