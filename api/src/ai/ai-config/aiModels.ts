import { ChatGroq } from "@langchain/groq";

export const llama318bModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
});

export const llama3370bModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

export const gemma29bModel = new ChatGroq({
  model: "gemma2-9b-it",
  temperature: 0,
});

export const whisperV3Model = new ChatGroq({
  model: "distil-whisper-large-v3-en",
  temperature: 0,
});

export const mixtral8x7bModel = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});

// Get AI Model
//TODO: Validate Model in Mongoose
export const getAiModel = (model: string): ChatGroq => {
  switch (model) {
    case "llama-3.1-8b-instant":
      return llama318bModel;
    case "llama-3.3-70b-versatile":
      return llama3370bModel;
    case "gemma2-9b-it":
      return gemma29bModel;
    case "distil-whisper-large-v3-en":
      return whisperV3Model;
    case "mixtral-8x7b-32768":
      return mixtral8x7bModel;
    default:
      throw new Error("Model not found");
  }
};
