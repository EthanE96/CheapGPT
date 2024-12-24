import { Router, Request, Response } from "express";
import passport from "passport";
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
  googleCallback,
  googleLogout,
  googleDashboard,
} from "./controllers/authController";
import { isAuthenticated } from "./middleware/authMiddleware";

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
router.post("/chats", postChat);
router.get("/chats", isAuthenticated, getChats);
router.get("/chats/:id", getChat);
router.patch("/chats/:id", patchChat);
router.delete("/chats/:id", deleteChat);
router.delete("/chats", deleteChats);
router.post("/chats/:id/messages", postMessage);

//* Authentication
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureMessage: true,
  }),
  googleCallback
);
router.get("/auth/logout", googleLogout);
router.get("/dashboard", googleDashboard);

export default router;
