import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  LOCAL_STORAGE_KEY: string = 'token';

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, token);
  }
}
