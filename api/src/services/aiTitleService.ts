import { HumanMessage } from "@langchain/core/messages";
import { titleTemplate } from "../ai/ai-config/aiTemplates";
import { ChatGroq } from "@langchain/groq";
import { Model } from "../models/modelModel";

// TODO: This needs to be updated to properly update the title of a chat, currnelty not working well.
// TODO: Pleas update to use llama-3.3-70b-versatile model for the title generation.

const titleChain = async (title: HumanMessage, model: Model) => {
  // convert my model into a ChatGroq model
  const groqModel = new ChatGroq({
    model: model.modelName,
  });

  const chain = titleTemplate.pipe(groqModel);
  const output = await chain.invoke({
    title: title,
  });

  return output.content;
};

export const newAiTitle = async (
  message: string,
  model: Model,
): Promise<string> => {
  try {
    if (!message) {
      throw new Error("No message");
    }
    return (await titleChain(new HumanMessage(message), model)) as string;
  } catch (error) {
    console.error(`Error creating title: ${error}`);
    throw error;
  }
};
