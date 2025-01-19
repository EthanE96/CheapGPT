import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { Model } from '../models/model.model';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  constructor(private http: HttpClient) {}
  baseURL = environment.apiUrl;
  modelObservable: Observable<Model[]> | undefined;

  //* Get All Models
  getModels(): Observable<Model[]> {
    if (this.modelObservable)
      return this.modelObservable as Observable<Model[]>;
    else {
      this.modelObservable = this.http
        .get<Model[]>(`${this.baseURL}/ai/models`, {
          withCredentials: true,
        })
        .pipe(catchError(this.handleError), shareReplay(1));
      return this.modelObservable as Observable<Model[]>;
    }
  }

  //* Error Handling
  // sends through the http response error
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
