import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";

export const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a highly intelligent AI assistant. Format all output in markdown! Use clear and logical headings to make your output easy to read. Always use headers for subheading! Format code using three backticks( ```).",
  ],
  new MessagesPlaceholder("messages"),
]);

export const titleTemplate = PromptTemplate.fromTemplate(
  "You are my title maker. You will analyze the message provided and create a very short and concise title for the chat. Use as few words as possible and NEVER more than one sentence. Never include periods. Here is the message: {title}"
);
