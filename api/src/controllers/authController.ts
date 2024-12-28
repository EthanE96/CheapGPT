import { Request, Response } from "express";

export const checkAuthStatus = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user, // This includes the user data from your session
    });
  } else {
    res.status(401).json({
      authenticated: false,
      message: "Not authenticated",
    });
  }
};

export const authCallback = (req: Request, res: Response) => {
  try {
    if (req.isAuthenticated()) {
      res.json({
        authenticated: true,
        message: "Authenticated",
        user: req.user,
      });
    } else {
      res.json({
        authenticated: false,
        message: "Unauthenticated",
      });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const authLogout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.json({ message: "Logged out successfully" });
  });
};
