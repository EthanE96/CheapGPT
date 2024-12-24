import { Request, Response } from "express";

export const googleCallback = (req: Request, res: Response) => {
  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); //TODO: Angular URL
    res.header("Access-Control-Allow-Credentials", "true");
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const googleLogout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    res.redirect("/api/dashboard");
  });
};

export const googleDashboard = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send(
      "<div>You are logged in</div><a href='/api/auth/logout'>Logout</a>"
    );
  } else {
    res.send("You are not logged in");
  }
};
