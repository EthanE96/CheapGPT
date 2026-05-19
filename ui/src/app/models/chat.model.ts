export interface Chat {
  _id?: string;
  message: Message[];
  modelId: string;
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
  style?: string;
}

export interface Tokens {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

export type StreamEvent =
  | { type: 'chunk'; content: string }
  | { type: 'done'; chat: Chat }
  | { type: 'error'; message: string };
