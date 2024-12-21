export interface Chat {
  _id?: string;
  message: Message[];
  model: string;
  apiKey: string;
  title?: string;
  totalTokens?: Tokens;
  totalCost?: number;
}

export interface Message {
  content: string;
  isUser: boolean;
  tokens?: Tokens;
  cost?: number;
  date?: Date;
}

export interface Tokens {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}
