import { Chat } from "../models/chatModel";
import { newAiMessage } from "./aiChatService";
import { newAiTitle } from "./aiTitleService";

//^ Create Chat
export const createChat = async (
  userId: string,
  model: string,
  apiKey: string,
  title?: string
): Promise<Chat> => {
  try {
    const newChat = new Chat({ userId, model, apiKey, title });
    return await newChat.save();
  } catch (error) {
    console.error(`Error creating chat: ${error}`);
    throw error;
  }
};

//^ Get Multiple Chats
export const fetchChats = async (userId: string): Promise<Chat[]> => {
  try {
    return await Chat.find({ userId: userId }).sort({ updatedAt: -1 });
  } catch (error) {
    console.error(`Error getting chats: ${error}`);
    throw error;
  }
};

//^ Get One Chat
export const fetchChat = async (
  id: string,
  userId: string
): Promise<Chat | null> => {
  try {
    return await Chat.findById(id, { userId: userId });
  } catch (error) {
    console.error(`Error getting chat: ${error}`);
    throw error;
  }
};

//^ Delete One Chat
export const removeChat = async (
  id: string,
  userId: string
): Promise<Chat | null> => {
  try {
    return await Chat.findByIdAndDelete(id, { userId: userId });
  } catch (error) {
    console.error(`Error deleting chat: ${error}`);
    throw error;
  }
};

//^ Delete Multiple Chats
export const removeChats = async (userId: string) => {
  try {
    return await Chat.deleteMany({ userId: userId });
  } catch (error) {
    console.error(`Error deleting chats: ${error}`);
    throw error;
  }
};

//^ Update One Chat
export const updateChat = async (
  id: string,
  update: Partial<Chat>,
  userId: string
): Promise<Chat | null> => {
  try {
    return await Chat.findByIdAndUpdate(id, update, {
      new: true,
      userId: userId,
    });
  } catch (error) {
    console.error(`Error updating chat: ${error}`);
    throw error;
  }
};

//^ Create Message
// returns updated chat with the new message
export const createMessage = async (
  chatId: string,
  newMessage: string,
  userId: string
): Promise<Chat | null> => {
  try {
    // if chat doesn't exist
    const chat = await fetchChat(chatId, userId);
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

    // if new message, add new title
    if (!lastMessage || lastMessage.content !== newMessage) {
      const title = await newAiTitle(newMessage);
      chat.title = title;
    }

    // this function accepts a chat and a new message and returns an updated chat with ai message
    const updatedChat = await newAiMessage(chat, newMessage);

    // save the updated chat
    return await updateChat(chatId, updatedChat, userId);
  } catch (error) {
    console.error(`Error creating message: ${error}`);
    throw error;
  }
};
