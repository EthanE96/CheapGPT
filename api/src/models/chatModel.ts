import { MessageContentComplex } from "@langchain/core/messages";
import mongoose, { Schema } from "mongoose";

export interface Chat {
  _id: string;
  userId: string;
  message?: Message[];
  modelId: string;
  title: string;
  totalTokens?: Tokens;
  totalCost?: number;
}

export interface Message {
  content: string | MessageContentComplex[];
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
    modelId: { type: String, ref: "Model", required: true },
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

// Middleware to calculate cost

//! Comment out, as Groq does disclose cost per token.
// chatSchema.pre("save", function (next) {
//   const chat = this as Chat;
//   if (chat.message && Array.isArray(chat.message)) {
//     chat.message.forEach((msg) => {
//       if (msg.tokens && msg.tokens.totalTokens) {
//         msg.cost =
//           msg.tokens.promptTokens * 0.003 + msg.tokens.completionTokens * 0.001;
//       }
//     });
//   }
//   next();
// });

export const Chat = mongoose.model<Chat>("Chat", chatSchema);
