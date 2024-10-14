import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

export const prompt = ChatPromptTemplate.fromMessages([["system", "Answer all questions to your best ability."], new MessagesPlaceholder("messages")]);
