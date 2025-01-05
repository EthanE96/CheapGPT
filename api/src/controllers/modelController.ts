import { Request, Response } from "express";
import { fetchModels } from "../services/modelService";

//^ Get Models
export const getModels = async (req: Request, res: Response) => {
  try {
    return res.status(201).json(await fetchModels());
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
