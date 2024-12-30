import { Request, Response, NextFunction } from "express";

// Middleware to check if the user is authenticated
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({
      authenticated: false,
      message: "Not authenticated",
    });
  }
}
