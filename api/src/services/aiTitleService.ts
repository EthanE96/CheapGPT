import { HumanMessage } from "@langchain/core/messages";
import { titleTemplate } from "../ai/ai-config/aiTemplates";
import { ChatGroq } from "@langchain/groq";
import { Model } from "../models/modelModel";

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
  model: Model
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
