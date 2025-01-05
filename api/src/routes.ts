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
  authCallback,
  authLogout,
  checkAuthStatus,
} from "./controllers/authController";
import { isAuthenticated } from "./middleware/authMiddleware";
import { getModels } from "./controllers/modelController";

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

//* AI Models
router.get("/ai/models", isAuthenticated, getModels);

//* Authentication
router.get("/auth/status", checkAuthStatus);
router.get("/auth/logout", authLogout);

// Google
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
    successRedirect: process.env.CLIENT_URL || "http://localhost:4200/",
  }),
  authCallback
);

// Github
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/auth/callback/github",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureMessage: true,
    successRedirect: process.env.CLIENT_URL || "http://localhost:4200/",
  }),
  authCallback
);

export default router;
