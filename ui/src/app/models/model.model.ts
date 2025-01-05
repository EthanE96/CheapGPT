export interface Model {
  _id?: string;
  modelDisplayName: string;
  modelName: string;
  temperature: number;
  maxTokens?: number;
  createdAt: Date;
  updatedAt?: Date;
}
