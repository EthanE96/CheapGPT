import { ChatGroq } from "@langchain/groq";

export const llama321bModel = new ChatGroq({
  model: "llama-3.2-1b-preview",
  temperature: 0,
});

export const mixtral8x7bModel = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});

// Get AI Model
export const getAiModel = (model: string): ChatGroq => {
  switch (model) {
    case "llama":
      return llama321bModel;
    case "mixtral":
      return mixtral8x7bModel;
    case "title":
      return llama321bModel;
    default:
      return llama321bModel;
  }
};
