import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { API_BASE_PATH } from '@core/config/api.config';

import { AUTH_API_ENDPOINTS } from '../config/auth-api-endpoints';
import { AuthTokenStorage } from '../storage/auth-token-storage';

const PUBLIC_AUTH_ENDPOINTS = [
  AUTH_API_ENDPOINTS.login,
  AUTH_API_ENDPOINTS.register,
] as const;

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
) => {
  const isApiRequest =
    request.url === API_BASE_PATH ||
    request.url.startsWith(
      `${API_BASE_PATH}/`,
    );

  const isPublicAuthRequest =
    PUBLIC_AUTH_ENDPOINTS.some(
      (endpoint) =>
        request.url === endpoint,
    );

  if (
    !isApiRequest ||
    isPublicAuthRequest
  ) {
    return next(request);
  }

  const tokenStorage =
    inject(AuthTokenStorage);

  const token =
    tokenStorage.get();

  if (!token) {
    return next(request);
  }

  const authenticatedRequest =
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

  return next(
    authenticatedRequest,
  );
};
