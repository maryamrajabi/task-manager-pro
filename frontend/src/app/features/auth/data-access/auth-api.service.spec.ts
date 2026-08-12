import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { AuthApiService } from './auth-api.service';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { CurrentUser } from '../models/current-user';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should send login request to the authentication API', () => {
    const request: LoginRequest = {
      email: 'user@example.com',
      password: 'TestPass123!',
    };

    const response: LoginResponse = {
      id: 1,
      fullName: 'Test User',
      email: 'user@example.com',
      token: 'jwt-token',
    };

    service.login(request).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const httpRequest = httpTesting.expectOne('/api/auth/login');

    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);

    httpRequest.flush(response);
  });

  it('should request the current authenticated user', () => {
    const response: CurrentUser = {
      email: 'user@example.com',
    };

    service.getCurrentUser().subscribe((result) => {
      expect(result).toEqual(response);
    });

    const httpRequest = httpTesting.expectOne('/api/auth/me');

    expect(httpRequest.request.method).toBe('GET');

    httpRequest.flush(response);
  });
});
