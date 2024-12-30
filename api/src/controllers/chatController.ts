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
    const userID = getUserId(req);
    const { model, apiKey, title } = req.body;
    const newChat = await createChat(userID, model, apiKey, title);
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//^ Get Chats
export const getChats = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const chats = await fetchChats(userID);
    if (chats.length === 0) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error });
  }
};

//^ Get Chat
export const getChat = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const chat = await fetchChat(req.params.id, userID);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//^ Update Chat
export const patchChat = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const updatedChat = await updateChat(req.params.id, req.body, userID);
    if (!updatedChat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//^ Delete Chat
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const chat = await removeChat(req.params.id, userID);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//^ Delete Chats
export const deleteChats = async (req: Request, res: Response) => {
  try {
    const userID = getUserId(req);
    const numberDeleted = await removeChats(userID);
    res.status(200).json(numberDeleted);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

//^ Post Message
export const postMessage = async (req: Request, res: Response) => {
  try {
    if (!req.body.content) {
      throw new Error("Message content is required");
    }
    const userID = getUserId(req);
    const newMessage = req.body.content as string;
    const chat = await fetchChat(req.params.id, userID);
    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const updatedChat = await createMessage(req.params.id, newMessage, userID);
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
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
