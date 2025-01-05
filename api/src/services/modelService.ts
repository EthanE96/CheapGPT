import { Model } from "../models/modelModel";

export const fetchModels = async () => {
  try {
    return await Model.find();
  } catch (error) {
    console.error(`Error getting models: ${error}`);
    throw error;
  }
};

export const fetchModel = async (id: string) => {
  try {
    return await Model.findById(id);
  } catch (error) {
    console.error(`Error getting model: ${error}`);
    throw error;
  }
};
