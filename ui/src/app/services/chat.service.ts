import { Injectable } from '@angular/core';
import { Chat } from '../models/chat';
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
      .get<Chat[]>(`${this.baseURL}/chats`)
      .pipe(catchError(this.handleError));
  }

  //^ Get Chat
  getChat(chatId: string): Observable<Chat> {
    return this.http
      .get<Chat>(`${this.baseURL}/chats/${chatId}`)
      .pipe(catchError(this.handleError));
  }

  //^ Create Chat
  postChat(chat: Chat): Observable<Chat> {
    return this.http
      .post<Chat>(`${this.baseURL}/chats`, chat)
      .pipe(catchError(this.handleError));
  }

  //^ Delete Chat
  deleteChat(chatId: string): Observable<Chat> {
    return this.http
      .delete<Chat>(`${this.baseURL}/chats/${chatId}`)
      .pipe(catchError(this.handleError));
  }

  //^ Create Message
  postMessage(chatId: string, message: string): Observable<Chat> {
    return this.http
      .post<Chat>(`${this.baseURL}/chats/${chatId}/messages`, message)
      .pipe(catchError(this.handleError));
  }

  //* Error Handling
  // sends through the http response error
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error);
  }
}
