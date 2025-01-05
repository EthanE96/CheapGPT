export interface Model {
  _id?: string;
  modelDisplayName: string;
  modelName: string;
  temperature: number;
  systemPrompt: string;
  maxTokens?: number;
  logo: string;
  createdAt: Date;
  updatedAt?: Date;
}
