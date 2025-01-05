export interface Model {
  _id?: string;
  modelDisplayName: string;
  modelName: string;
  temperature: number;
  maxTokens?: number;
  logo: string;
  createdAt: Date;
  updatedAt?: Date;
}
