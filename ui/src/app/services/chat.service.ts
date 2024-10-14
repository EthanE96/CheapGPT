import { Injectable } from '@angular/core';
import { ChatString } from '../models/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}

  getAllChats() {
    const chatStrings: ChatString[] = [
      {
        message: [
          {
            content: 'Hello, what is 3 + 3?',
            isUser: true,
            token: 50,
            cost: 0.01,
            date: new Date(),
          },
          {
            content: 'The answer is 6.',
            isUser: false,
            token: 70,
            cost: 0.2,
            date: new Date(),
          },
        ],
        model: 'gpt-3.5-turbo',
        apiKey: '',
        title: 'Math',
        totalTokens: 120,
        totalCost: 0.03,
      },
      {
        message: [
          {
            content: 'Hello, what the best car?',
            isUser: true,
            token: 50,
            cost: 0.01,
            date: new Date(),
          },
          {
            content: 'The answer is a toyota landcruiser.',
            isUser: false,
            token: 70,
            cost: 0.2,
            date: new Date(),
          },
        ],
        model: 'gpt-3.5-turbo',
        apiKey: '',
        title: 'Car',
        totalTokens: 120,
        totalCost: 0.03,
      },
    ];
    return chatStrings;
  }

  getChat(): ChatString {
    const chatString: ChatString = {
      message: [
        {
          content: 'Hello, what is 3 + 3?',
          isUser: true,
          token: 50,
          cost: 0.01,
          date: new Date(),
        },
        {
          content: 'The answer is 6.',
          isUser: false,
          token: 70,
          cost: 0.2,
          date: new Date(),
        },
      ],
      model: 'gpt-3.5-turbo',
      apiKey: '',
      title: 'Math',
      totalTokens: 120,
      totalCost: 0.03,
    };
    return chatString;
  }
}
