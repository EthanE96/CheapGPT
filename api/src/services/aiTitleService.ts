import { HumanMessage } from "@langchain/core/messages";
import { titleTemplate } from "../ai/ai-config/aiTemplates";
import { ChatGroq } from "@langchain/groq";

const titleChain = async (title: HumanMessage, llmModel: ChatGroq) => {
  const chain = titleTemplate.pipe(llmModel);
  const output = await chain.invoke({
    title: title,
  });

  return output.content;
};

export const newAiTitle = async (
  message: string,
  llmModel: ChatGroq
): Promise<string> => {
  try {
    if (!message) {
      throw new Error("No message");
    }
    return (await titleChain(new HumanMessage(message), llmModel)) as string;
  } catch (error) {
    console.error(`Error creating title: ${error}`);
    throw error;
  }
};
