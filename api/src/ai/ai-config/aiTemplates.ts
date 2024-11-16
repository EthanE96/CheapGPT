import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export const chatTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a highly intelligent AI assistant. Format all output in markdown! Use clear and logical headings to make your output easy to read. Always use headers for subheading! Format code using three backticks( ```).",
  ],
  new MessagesPlaceholder("messages"),
]);

export const titleTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are my chat title maker. You will analyze the message provided and create a very short and concise title for the chat string. Use as few words as possible and NEVER more than one sentence. Never include periods.",
  ],
  new MessagesPlaceholder("title"),
]);

export const basicTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are an AI assistant"],
  new MessagesPlaceholder("messages"),
]);

export const getAiTemplate = (template: string): ChatPromptTemplate => {
  switch (template) {
    case "chat":
      return chatTemplate;
    case "title":
      return titleTemplate;
    default:
      return basicTemplate;
  }
};
