import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Initial_State, ResponseItem, Token, TokenRes } from './interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private accessToken = signal<string>('');
  private refreshToken = signal<string>('');
  private user = signal<Token>(Initial_State)

  e = effect(() => {
    if (this.accessToken()) localStorage.setItem('access-token', this.accessToken());
    if (this.refreshToken()) localStorage.setItem('refresh-token', this.refreshToken());
    if (this.user() != Initial_State) localStorage.setItem('user', JSON.stringify(this.user()));
  })

  login = (loginCredentials: { email?: string, password?: string }): Observable<ResponseItem<TokenRes>> => {
    return this.httpClient.post<ResponseItem<TokenRes>>(`${environment.api_url}/auth/login`, loginCredentials);
  }
  register = (loginCredentials: { fullname?: string, email?: string, password?: string }): Observable<ResponseItem<{ email: string, fullname: string }>> => {
    return this.httpClient.post<ResponseItem<{ email: string, fullname: string }>>(`${environment.api_url}/auth/register`, loginCredentials);
  }

  refresh = (refreshToken: string): Observable<ResponseItem<TokenRes>> => {
    return this.httpClient.post<ResponseItem<TokenRes>>(`${environment.api_url}/auth/refresh-token`, { refreshToken });
  }

  isLoggedIn = () => {
    return this.accessToken() && this.accessToken() != '';
  }

  getAccessToken(): string {
    return this.accessToken();
  }

  getRefreshToken(): string {
    return this.refreshToken();
  }

  getUser(): Token {
    return this.user();
  }

  logout = () => {
    localStorage.clear();
    this.accessTokenValue = "";
    this.refreshTokenValue = "";
    this.router.navigate(['login']);
  }

  set accessTokenValue(value: string) {
    this.accessToken.set(value);
  }

  set refreshTokenValue(value: string) {
    this.refreshToken.set(value);
  }

  set userValue(value: Token) {
    this.user.set(value);
  }

}
