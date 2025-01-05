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
import { getChatTemplate } from "../ai/ai-config/aiTemplates";

//Models
import { Chat, Message } from "../models/chatModel";
import { Model } from "../models/modelModel";
import { ChatGroq } from "@langchain/groq";

/**
 * Calls a model with a given input and returns the response
 * @param {Object} input - an object with a messages property
 * @returns {Promise<AIMessage>} - the response from the AI model
 */
const chatChain = async (
  input: {
    messages: (HumanMessage | AIMessage | SystemMessage)[];
  },
  model: Model
) => {
  // Define the function that calls the model
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    // convert my model into a ChatGroq model
    const groqModel = new ChatGroq({
      model: model.modelName,
    });

    const chain = getChatTemplate(model).pipe(groqModel);
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
      return new HumanMessage(message.content as string);
    } else {
      return new AIMessage(message.content as string);
    }
  });
};

/**
 * Handles a new message in a chat, and appends the AI's response to the chat.
 *
 * @param chat The chat to append the AI's response to
 * @param newMessage The new message to process
 * @returns The updated chat with the AI's response
 */
export const newAiMessage = async (
  chat: Chat,
  newMessage: string,
  model: Model
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
  const output = await chatChain(input, model);

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
