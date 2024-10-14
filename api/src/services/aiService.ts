import { START, END, MessagesAnnotation, StateGraph, MemorySaver } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { llm } from "../ai/ai-model/mixtral-8x7b-32768";
import { prompt } from "../ai/ai-prompt/basic";
import { trimmer } from "../ai/ai-config/config";
import { Chat, Message } from "../models/chatModel";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

//! Here we will need to select the model and key from settings

const callAI = async (input: { messages: (HumanMessage | AIMessage | SystemMessage)[] }) => {
  // Define the function that calls the model
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const chain = prompt.pipe(llm);
    // Message trimmer
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

const convertMessages = (message: Message[]): (SystemMessage | HumanMessage | AIMessage)[] => {
  return message.map((message) => {
    if (message.isUser) {
      return new HumanMessage(message.content);
    } else {
      return new AIMessage(message.content);
    }
  });
};

export const aiNewMessage = async (chat: Chat, newMessage: string): Promise<Chat> => {
  //How to handle the title (only if set as "New Chat")
  //maybe new function that uses the new message to set the title, can use a super cheap ai model

  // Message converter
  if (!chat.message) {
    chat.message = [];
  }
  const messages = convertMessages(chat.message);

  // Add the new message
  const input = {
    messages: [...messages, new HumanMessage(newMessage)],
  };

  // Call AI
  const output = await callAI(input);

  // Update message history with response
  chat.message.push({
    content: output.content,
    isUser: false,
    tokens: output.response_metadata.tokenUsage,
  });

  //TODO: Update total tokens
  //TODO: Update total cost

  return chat;
};
