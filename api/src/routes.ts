import { Router } from "express";
import { Request, Response } from "express";
import {
  deleteChat,
  deleteChats,
  getChat,
  getChats,
  postChat,
  postMessage,
  patchChat,
} from "./controllers/chatController";
import {
  loginGoogle,
  loginGoogleCallback,
  loginPage,
  logout,
} from "./controllers/authController";

const router = Router();

//^ Public routes
// /api/health
router.get("/health", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "OK" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//^ Private routes
//* Chat
// /api/chat
router.post("/chats", postChat);
router.get("/chats", getChats);
router.get("/chats/:id", getChat);
router.patch("/chats/:id", patchChat);
router.delete("/chats/:id", deleteChat);
router.delete("/chats", deleteChats);
router.post("/chats/:id/messages", postMessage);

//* Authentication
// /api/auth
router.get("/login", loginPage);
router.get("/login/federated/google", loginGoogle);
router.get("/oauth2/redirect/google", loginGoogleCallback);
router.post("/logout", logout);

export default router;
