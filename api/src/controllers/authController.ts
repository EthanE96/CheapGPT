import { Request, Response, NextFunction, Router } from "express";
import passport from "passport";

const router = Router();

//TODO: THIS MIGHT Exist as var ensureLoggedIn = ensureLogIn();
// Custom middleware to check authentication
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Login page
export const loginPage = (req: Request, res: Response) => {
  res.render("login");
};

// Initiate Google OAuth flow
export const loginGoogle = () => {
  passport.authenticate("google");
};

// Google OAuth callback
export const loginGoogleCallback = () => {
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  });
};

// Logout
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export default router;
