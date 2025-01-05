import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { Model } from "../../models/modelModel";

export const getChatTemplate = (model: Model) => {
  if (!model.systemPrompt) {
    throw new Error("No model provided");
  }

  return ChatPromptTemplate.fromMessages([
    ["system", model.systemPrompt],
    new MessagesPlaceholder("messages"),
  ]);
};

export const titleTemplate = PromptTemplate.fromTemplate(
  "You are my title maker. You will analyze the message provided and create a very short and concise title for the chat. Use as few words as possible and NEVER more than one sentence. Never include periods. Here is the message: {title}"
);
