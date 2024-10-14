import { Router } from "express";
import { Request, Response } from "express";
import { deleteChat, getChat, getChats, postChat, postMessage } from "./controllers/chatController";

const router = Router();

// All routes begin with /api

//^ Public routes
// /api/health
router.get("/health", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//^ Private routes with authentication
// /api/chat
router.post("/chats", postChat);
router.get("/chats", getChats);
router.get("/chats/:id", getChat);
router.delete("/chats/:id", deleteChat);
router.post("/chats/:id/messages", postMessage);

export default router;
