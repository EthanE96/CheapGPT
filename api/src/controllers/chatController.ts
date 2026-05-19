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
import { streamAiMessage } from "../services/aiChatService";
import { ResponseStyle } from "../ai/ai-config/aiTemplates";
import { fetchModel } from "../services/modelService";
import { newAiTitle } from "../services/aiTitleService";
import { User } from "../models/userModel";
import { Tokens } from "../models/chatModel";

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

//^ Post Message (Streaming)
export const postMessageStream = async (req: Request, res: Response) => {
  try {
    if (!req.body.content) {
      return res.status(400).json({ error: "Message content is required" });
    }
    const userID = getUserId(req);
    const chat = await fetchChat(req.params.id, userID);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const model = await fetchModel(chat.modelId);
    if (!model) return res.status(404).json({ error: "Model not found" });

    const style: ResponseStyle = req.body.style ?? "balanced";

    // Generate title only on the first message, fire-and-forget
    const lastMessage = chat.message?.[chat.message.length - 1];
    if (!lastMessage) {
      newAiTitle(req.body.content)
        .then((title) => {
          chat.title = title;
        })
        .catch(() => {});
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const send = (data: object) =>
      res.write(`data: ${JSON.stringify(data)}\n\n`);

    let fullContent = "";
    let finalTokens: Tokens = {
      totalTokens: 0,
      promptTokens: 0,
      completionTokens: 0,
    };

    try {
      for await (const event of streamAiMessage(
        chat,
        req.body.content,
        model,
        style,
      )) {
        if (event.type === "chunk") {
          fullContent += event.content;
          send(event);
        } else if (event.type === "done") {
          finalTokens = event.tokens;
        }
      }

      chat.message!.push({
        content: fullContent,
        isUser: false,
        tokens: finalTokens,
        style,
      });
      if (!chat.totalTokens) {
        chat.totalTokens = {
          totalTokens: 0,
          promptTokens: 0,
          completionTokens: 0,
        };
      }
      chat.totalTokens.totalTokens += finalTokens.totalTokens;
      chat.totalTokens.promptTokens += finalTokens.promptTokens;
      chat.totalTokens.completionTokens += finalTokens.completionTokens;

      const updatedChat = await updateChat(chat._id, chat, userID);
      send({ type: "done", chat: updatedChat });
    } catch (err) {
      send({ type: "error", message: (err as Error).message });
    } finally {
      res.end();
    }
  } catch (error) {
    if (res.headersSent) {
      res.write(
        `data: ${JSON.stringify({ type: "error", message: (error as Error).message })}\n\n`,
      );
      res.end();
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
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
