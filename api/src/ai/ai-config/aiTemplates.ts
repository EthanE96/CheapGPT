import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { Model } from "../../models/modelModel";

export type ResponseStyle = "concise" | "balanced" | "detailed";

const stylePrefix: Record<ResponseStyle, string> = {
  concise:
    "Respond as briefly as possible. Use short sentences and bullet points where appropriate. Skip all preamble and filler. ",
  balanced: "",
  detailed:
    "Provide a thorough, comprehensive response. Include context, examples, and elaboration. Cover all relevant aspects in depth. ",
};

export const getChatTemplate = (model: Model, style: ResponseStyle = "balanced") => {
  if (!model.systemPrompt) {
    throw new Error("No model provided");
  }

  const systemPrompt = stylePrefix[style] + model.systemPrompt;

  return ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("messages"),
  ]);
};

export const titleTemplate = PromptTemplate.fromTemplate(
  "Generate a very short chat title (3-6 words max) for this message. Reply with only the title, no punctuation, no quotes: {message}",
);
