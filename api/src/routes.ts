import { Router } from "express";
import { Request, Response } from "express";

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
// /api/

export default router;
