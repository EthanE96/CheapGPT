import { ChatGroq } from "@langchain/groq";

export const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});
