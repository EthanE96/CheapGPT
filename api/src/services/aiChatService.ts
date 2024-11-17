//Lang
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

//AI
import { trimmer } from "../ai/ai-config/aiConfig";
import { getAiModel } from "../ai/ai-config/aiModels";
import { chatTemplate } from "../ai/ai-config/aiTemplates";

//Models
import { Chat, Message } from "../models/chatModel";

const chatChain = async (
  input: {
    messages: (HumanMessage | AIMessage | SystemMessage)[];
  },
  model: string
) => {
  // Define the function that calls the model
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const newModel = getAiModel(model);
    const chain = chatTemplate.pipe(newModel);
    const trimmedMessage = await trimmer.invoke(state.messages);

    const response = await chain.invoke({
      messages: trimmedMessage,
    });
    // Update message history with response:
    return { messages: [response] };
  };

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    // Define the node and edge
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  // Add memory
  const app = workflow.compile({ checkpointer: new MemorySaver() });

  // Support multiple conversation threads
  const config = { configurable: { thread_id: uuidv4() } };

  // Output
  const output = await app.invoke(input, config);
  return output.messages[output.messages.length - 1];
};

const convertMessages = (
  message: Message[]
): (SystemMessage | HumanMessage | AIMessage)[] => {
  return message.map((message) => {
    if (message.isUser) {
      return new HumanMessage(message.content);
    } else {
      return new AIMessage(message.content);
    }
  });
};

export const newAiMessage = async (
  chat: Chat,
  newMessage: string
): Promise<Chat> => {
  // Message converter
  chat.message = chat.message || [];
  chat.message.push({ content: newMessage, isUser: true });
  const messages = convertMessages(chat.message);

  // Add the new message
  const input = {
    messages: [...messages, new HumanMessage(newMessage)],
  };

  // Call AI
  const output = await chatChain(input, "mixtral");

  // Update message history with response
  chat.message.push({
    content: output.content,
    isUser: false,
    tokens: output.response_metadata.tokenUsage,
  });

  // Update total tokens
  if (!chat.totalTokens || !chat.totalTokens.totalTokens) {
    chat.totalTokens = {
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
    };
  }
  chat.totalTokens.totalTokens +=
    output.response_metadata.tokenUsage.totalTokens;
  chat.totalTokens.promptTokens +=
    output.response_metadata.tokenUsage.promptTokens;
  chat.totalTokens.completionTokens +=
    output.response_metadata.tokenUsage.completionTokens;

  return chat;
};
