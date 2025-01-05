import { Request, Response } from "express";
import {
  createChat,
  fetchChats,
  fetchChat,
  removeChat,
  createMessage,
  removeChats,
  updateChat,
} from "../services/chatService";
import { User } from "../models/userModel";

//^ Post Chat
export const postChat = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { modelId, apiKey, title } = req.body;
    const newChat = await createChat(userId, modelId, apiKey, title);
    return res.status(201).json(newChat);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

//^ Get Chats
export const getChats = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const chats = await fetchChats(userID);
    if (chats.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//^ Get Chat
export const getChat = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const chat = await fetchChat(req.params.id, userID);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

//^ Update Chat
export const patchChat = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const updatedChat = await updateChat(req.params.id, req.body, userID);
    if (!updatedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

//^ Delete Chat
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const chat = await removeChat(req.params.id, userID);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

//^ Delete Chats
export const deleteChats = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const numberDeleted = await removeChats(userID);
    return res.status(200).json(numberDeleted);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

//^ Post Message
export const postMessage = async (req: Request, res: Response) => {
  try {
    // Check if the message content is valid
    if (!req.body.content) {
      return res.status(400).json({ error: "Message content is required" });
    }
    const userID = getUserId(req);

    // Check if the message is valid
    const newMessage = req.body.content as string;
    if (!newMessage) {
      return res.status(400).json({ error: "Message is invalid" });
    }

    // Check if the chat exists
    const chat = await fetchChat(req.params.id, userID);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Create the message
    const updatedChat = await createMessage(chat, newMessage, userID);

    return res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// ^ Get User ID from the Session from the Request
const getUserId = (req: Request): string => {
  if (!req.user) {
    throw new Error("User is not authenticated");
  }

  const userID = (req.user as User)._id;
  if (!userID) {
    throw new Error("User ID not found");
  }

  return userID;
};
