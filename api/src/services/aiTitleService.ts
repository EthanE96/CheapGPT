import { HumanMessage } from "@langchain/core/messages";
import { getAiModel } from "../ai/ai-config/aiModels";
import { getAiTemplate } from "../ai/ai-config/aiTemplates";

const titleChain = async (
  title: HumanMessage,
  model: string,
  template: string
) => {
  // Define the function that calls the model
  const newModel = getAiModel(model);
  const newTemplate = getAiTemplate(template);
  const chain = newTemplate.pipe(newModel);

  const output = await chain.invoke({
    title: title,
  });
  return output.content;
};

export const newAiTitle = async (message: string): Promise<string> => {
  try {
    if (!message) {
      throw new Error("No message");
    }

    return (await titleChain(
      new HumanMessage(message),
      "title",
      "title"
    )) as string;
  } catch (error) {
    console.error(`Error creating title: ${error}`);
    throw error;
  }
};
