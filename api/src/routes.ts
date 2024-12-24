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

// TODO: Add auth middleware to routes

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
router.post("/chats", isAuthenticated, postChat);
router.get("/chats", isAuthenticated, getChats);
router.get("/chats/:id", isAuthenticated, getChat);
router.patch("/chats/:id", isAuthenticated, patchChat);
router.delete("/chats/:id", isAuthenticated, deleteChat);
router.delete("/chats", isAuthenticated, deleteChats);
router.post("/chats/:id/messages", isAuthenticated, postMessage);

//* Authentication
router.get("/auth/verify", isAuthenticated);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
    successRedirect: "/",
  }),
  googleCallback
);
router.get("/auth/logout", googleLogout);
router.get("/dashboard", googleDashboard);

export default router;
