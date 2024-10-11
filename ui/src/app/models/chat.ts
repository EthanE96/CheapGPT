export interface ChatString {
  message?: Message[];
  model: string;
  apiKey: string;
  title: string;
  TotalTokens?: number;
  TotalCost?: number;
}

export interface Message {
  content: string;
  isUser: boolean;
  token?: number;
  cost?: number;
  date: Date;
}
