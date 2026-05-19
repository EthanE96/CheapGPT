import { Injectable } from '@angular/core';
import { Chat, StreamEvent } from '../models/chat.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}
  baseURL = environment.apiUrl;

  //* CRUD Functions
  //^ Get Chats
  getChats(): Observable<Chat[]> {
    return this.http
      .get<Chat[]>(`${this.baseURL}/chats`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  //^ Get Chat
  getChat(chatId: string): Observable<Chat> {
    return this.http
      .get<Chat>(`${this.baseURL}/chats/${chatId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  //^ Create Chat
  postChat(chat: Chat): Observable<Chat> {
    return this.http
      .post<Chat>(`${this.baseURL}/chats`, chat, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  //^ Edit Chat
  patchChat(chat: Chat): Observable<Chat> {
    return this.http
      .patch<Chat>(`${this.baseURL}/chats/${chat._id}`, chat, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  //^ Delete Chat
  deleteChat(chatId: string): Observable<Chat> {
    return this.http
      .delete<Chat>(`${this.baseURL}/chats/${chatId}`, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  //^ Delete All Chats
  deleteChats(): Observable<number> {
    return this.http
      .delete<number>(`${this.baseURL}/chats`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  //^ Create Message
  /**
   * Posts a new message to an existing chat
   *
   * @param chatId The ID of the chat to post the message to
   * @param message The new message to be posted
   * @returns The updated chat with the new message
   */
  postMessage(chatId: string, message: string): Observable<Chat> {
    const requestBody = {
      content: message,
    };

    return this.http
      .post<Chat>(`${this.baseURL}/chats/${chatId}/messages`, requestBody, {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  //^ Stream Message
  streamMessage(chatId: string, message: string): Observable<StreamEvent> {
    return new Observable<StreamEvent>((subscriber) => {
      const controller = new AbortController();

      fetch(`${this.baseURL}/chats/${chatId}/messages/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
        credentials: 'include',
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            subscriber.error(body?.error ?? 'Stream request failed');
            return;
          }
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const frames = buffer.split('\n\n');
              buffer = frames.pop()!;
              for (const frame of frames) {
                if (!frame.startsWith('data: ')) continue;
                try {
                  const event = JSON.parse(frame.slice(6)) as StreamEvent;
                  subscriber.next(event);
                  if (event.type === 'done' || event.type === 'error') {
                    subscriber.complete();
                    return;
                  }
                } catch { /* skip malformed frame */ }
              }
            }
          } catch (err) {
            if ((err as Error).name !== 'AbortError') subscriber.error(err);
          } finally {
            reader.releaseLock();
            subscriber.complete();
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') subscriber.error(err);
        });

      return () => controller.abort();
    });
  }

  //* Error Handling
  // sends through the http response error
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
