import { Chat } from "../models/chatModel";
import { aiNewMessage } from "./aiService";

//^ Create Chat
export const createChat = async (model: string, apiKey: string, title?: string): Promise<Chat> => {
  try {
    const newChat = new Chat({ model, apiKey, title });
    return await newChat.save();
  } catch (error) {
    console.error(`Error creating chat: ${error}`);
    throw error;
  }
};

//^ Get Chats
export const fetchChats = async (): Promise<Chat[]> => {
  try {
    return await Chat.find();
  } catch (error) {
    console.error(`Error getting chats: ${error}`);
    throw error;
  }
};

//^ Get Chat
export const fetchChat = async (id: string): Promise<Chat | null> => {
  try {
    return await Chat.findById(id);
  } catch (error) {
    console.error(`Error getting chat: ${error}`);
    throw error;
  }
};

//^ Delete Chat
export const removeChat = async (id: string): Promise<Chat | null> => {
  try {
    return await Chat.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Error deleting chat: ${error}`);
    throw error;
  }
};

//^ Update Chat
export const updateChat = async (id: string, update: Partial<Chat>): Promise<Chat | null> => {
  try {
    return await Chat.findByIdAndUpdate(id, update, { new: true });
  } catch (error) {
    console.error(`Error updating chat: ${error}`);
    throw error;
  }
};

//^ Create Message
// returns updated chat with the new message
export const createMessage = async (chatId: string, newMessage: string): Promise<Chat | null> => {
  try {
    // if chat doesn't exist
    const chat = await fetchChat(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    // if message is empty
    if (!newMessage) {
      throw new Error("Message is empty");
    }

    // if the last message isn't a AI message (should always be, ai can't answer twice)
    const lastMessage = chat.message?.[chat.message.length - 1];
    if (lastMessage && lastMessage.isUser) {
      throw new Error("Last message is not a AI message");
    }

    // this function accepts a chat and a new message and returns an updated chat with ai message
    const updatedChat = await aiNewMessage(chat, newMessage);

    // save the updated chat
    return await updateChat(chatId, updatedChat);
  } catch (error) {
    console.error(`Error creating message: ${error}`);
    throw error;
  }
};