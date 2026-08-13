import { API_BASE_PATH } from '@core/config/api.config';

const AUTH_BASE_PATH =
  `${API_BASE_PATH}/auth`;

export const AUTH_API_ENDPOINTS = {
  login: `${AUTH_BASE_PATH}/login`,
  register: `${AUTH_BASE_PATH}/register`,
  currentUser: `${AUTH_BASE_PATH}/me`,
} as const;
