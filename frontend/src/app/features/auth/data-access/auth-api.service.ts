import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AUTH_API_ENDPOINTS } from '../config/auth-api-endpoints';
import { CurrentUser } from '../models/current-user';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  login(
    request: LoginRequest,
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      AUTH_API_ENDPOINTS.login,
      request,
    );
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(
      AUTH_API_ENDPOINTS.currentUser,
    );
  }
}
