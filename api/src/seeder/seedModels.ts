import { Model } from "../models/modelModel";

const seedData: Model[] = [
  new Model({
    modelDisplayName: "Llama 3.1-8b Instance",
    modelName: "llama-3.1-8b-instant",
    temperature: 0,
    logo: "/model-logos/meta.png",
  }),
  new Model({
    modelDisplayName: "Llama 3.3-70b Versatile",
    modelName: "llama-3.3-70b-versatile",
    temperature: 0,
    logo: "/model-logos/meta.png",
  }),
  new Model({
    modelDisplayName: "Gemma2-9b",
    modelName: "gemma2-9b-it",
    temperature: 0,
    logo: "/google_logo.png",
  }),
  new Model({
    modelDisplayName: "Mixtral-8x7b",
    modelName: "mixtral-8x7b-32768",
    temperature: 0,
    logo: "/model-logos/mistral.png",
  }),
];

export const seedModels = async () => {
  const existingModels = await Model.find({});
  if (existingModels.length === 0) {
    console.log("Seeding models");
    await Model.insertMany(seedData);
  }
};
