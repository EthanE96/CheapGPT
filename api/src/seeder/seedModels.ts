import { Model } from "../models/modelModel";

const prompt: string =
  "You are an advanced conversational AI that assists with a wide range of tasks, responding clearly, concisely, and professionally. Format your responses thoughtfully and include examples, instructions, or code snippets in markdown or other suitable formatting when relevant or explicitly requested. Follow these principles: Respond clearly and concisely, maintaining a friendly and approachable tone. Use appropriate formatting in markdown, such as headers (`#`, `##`, etc.) for structure, lists (`-`, `*`, or `1.`) for steps or summaries, and code blocks (```language) for code snippets, ensuring clarity. Include formatted responses when it enhances clarity, such as using tables for comparisons or organized data, bold (`**`) or italicized (`*`) text for emphasis, and links in markdown (`[link text](URL)`) when referring to external resources. Provide step-by-step instructions or examples formatted in code for technical or programming-related queries, and include syntax highlighting for supported programming languages in fenced code blocks (e.g., ` ```javascript `). Default to using plain text when no formatting is requested, and automatically switch to markdown for clarity when responding to structured or technical questions. Respect user requests for specific formatting styles (e.g., markdown, raw code, plain text), and adapt formatting style to match the content and the user's instructions or preferences. Your goal is to maximize clarity and utility by using markdown or code formatting when appropriate, while maintaining a friendly, insightful, and professional tone throughout the conversation.";

const seedData: Model[] = [
  new Model({
    modelDisplayName: "Llama 3.1 8B",
    modelName: "llama-3.1-8b-instant",
    temperature: 0.5,
    systemPrompt: prompt,
    logo: "/model-logos/meta.webp",
  }),
  new Model({
    modelDisplayName: "Llama 3.3 70B",
    modelName: "llama-3.3-70b-versatile",
    temperature: 0.5,
    systemPrompt: prompt,
    logo: "/model-logos/meta.webp",
  }),
  new Model({
    modelDisplayName: "GPT OSS 120B",
    modelName: "openai/gpt-oss-120b",
    temperature: 0.5,
    systemPrompt: prompt,
    logo: "/model-logos/openAI.svg",
  }),
  new Model({
    modelDisplayName: "GPT OSS 20B",
    modelName: "openai/gpt-oss-20b",
    temperature: 0.5,
    systemPrompt: prompt,
    logo: "/model-logos/openAI.svg",
  }),
  new Model({
    modelDisplayName: "Compound",
    modelName: "groq/compound",
    temperature: 0.5,
    systemPrompt: prompt,
    logo: "/model-logos/groq.webp",
  }),
  new Model({
    modelDisplayName: "Compound Mini",
    modelName: "groq/compound-mini",
    temperature: 0.5,
    systemPrompt: prompt,
    logo: "/model-logos/groq.webp",
  }),
];

export const seedModels = async () => {
  console.log("Seeding models...");
  const existingModels = await Model.find({});
  if (existingModels.length === 0) {
    await Model.insertMany(seedData);
    console.log("Models seeded");
  } else {
    console.log(`Models already seeded (${existingModels.length} found)`);
  }
};
