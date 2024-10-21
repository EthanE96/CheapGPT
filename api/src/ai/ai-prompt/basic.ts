import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

export const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a highly intelligent AI assistant. Format all output in markdown! Use clear and logical headings to make your output easy to read. Always use headers for subheading! Format code using three backticks( ```).",
  ],
  new MessagesPlaceholder("messages"),
]);
