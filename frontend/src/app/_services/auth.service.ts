import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BACKEND_URL } from '../../globals';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private userService: UserService) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${BACKEND_URL}/login`, credentials).pipe(
      tap(value => {
        const { accessToken } = value as { accessToken: string };
        this.userService.setToken(accessToken);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  logout(): void {
    this.userService.removeToken();
  }

  register(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${BACKEND_URL}/register`, credentials);
  }
}
