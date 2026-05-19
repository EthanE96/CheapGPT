import { titleTemplate } from "../ai/ai-config/aiTemplates";
import { ChatGroq } from "@langchain/groq";

const titleModel = new ChatGroq({ model: "llama-3.3-70b-versatile" });
const titleChain = titleTemplate.pipe(titleModel);

export const newAiTitle = async (message: string): Promise<string> => {
  try {
    if (!message) throw new Error("No message");
    const output = await titleChain.invoke({ message });
    return output.content as string;
  } catch (error) {
    console.error(`Error creating title: ${error}`);
    throw error;
  }
};
