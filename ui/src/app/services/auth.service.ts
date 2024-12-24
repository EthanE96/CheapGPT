import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  baseURL = environment.apiUrl;

  isAuthenticated(): Observable<number> {
    return (
      this.http
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .get<HttpResponse<any>>(`${this.baseURL}/auth/verify`, {
          observe: 'response',
        })
        .pipe(map((response) => response.status))
    );
  }

  googleLogin() {
    return this.http.get(`${this.baseURL}/auth/google`, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.get(`${this.baseURL}/auth/logout`);
  }

  //* Error Handling
  // sends through the http response error
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error);
  }
}
