import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { vi } from 'vitest';

import { AuthTokenStorage } from '../storage/auth-token-storage';

import { authInterceptor } from './auth.interceptor';

const tokenStorageMock = {
  get: vi.fn(),
};

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    tokenStorageMock.get.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            authInterceptor,
          ]),
        ),

        provideHttpClientTesting(),

        {
          provide: AuthTokenStorage,
          useValue: tokenStorageMock,
        },
      ],
    });

    http =
      TestBed.inject(HttpClient);

    httpTesting =
      TestBed.inject(
        HttpTestingController,
      );
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should attach the bearer token to a protected API request', () => {
    tokenStorageMock.get.mockReturnValue(
      'test-token',
    );

    http.get('/api/auth/me')
      .subscribe();

    const request =
      httpTesting.expectOne(
        '/api/auth/me',
      );

    expect(
      request.request.headers.get(
        'Authorization',
      ),
    ).toBe(
      'Bearer test-token',
    );

    request.flush({
      email: 'user@example.com',
    });
  });

  it('should not attach an authorization header when no token exists', () => {
    tokenStorageMock.get.mockReturnValue(
      null,
    );

    http.get('/api/auth/me')
      .subscribe();

    const request =
      httpTesting.expectOne(
        '/api/auth/me',
      );

    expect(
      request.request.headers.has(
        'Authorization',
      ),
    ).toBe(false);

    request.flush({
      email: 'user@example.com',
    });
  });

  it('should not attach the token to the login endpoint', () => {
    tokenStorageMock.get.mockReturnValue(
      'test-token',
    );

    http.post(
      '/api/auth/login',
      {
        email: 'user@example.com',
        password: 'TestPass123!',
      },
    ).subscribe();

    const request =
      httpTesting.expectOne(
        '/api/auth/login',
      );

    expect(
      request.request.headers.has(
        'Authorization',
      ),
    ).toBe(false);

    expect(
      tokenStorageMock.get,
    ).not.toHaveBeenCalled();

    request.flush({});
  });

  it('should not attach the token to the register endpoint', () => {
    tokenStorageMock.get.mockReturnValue(
      'test-token',
    );

    http.post(
      '/api/auth/register',
      {
        fullName: 'Test User',
        email: 'user@example.com',
        password: 'TestPass123!',
      },
    ).subscribe();

    const request =
      httpTesting.expectOne(
        '/api/auth/register',
      );

    expect(
      request.request.headers.has(
        'Authorization',
      ),
    ).toBe(false);

    request.flush({});
  });

  it('should not attach the token to a non-API request', () => {
    tokenStorageMock.get.mockReturnValue(
      'test-token',
    );

    http.get('/i18n/en.json')
      .subscribe();

    const request =
      httpTesting.expectOne(
        '/i18n/en.json',
      );

    expect(
      request.request.headers.has(
        'Authorization',
      ),
    ).toBe(false);

    expect(
      tokenStorageMock.get,
    ).not.toHaveBeenCalled();

    request.flush({});
  });
});
