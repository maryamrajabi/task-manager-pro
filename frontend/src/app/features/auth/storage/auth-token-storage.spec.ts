import { TestBed } from '@angular/core/testing';

import { AuthTokenStorage } from './auth-token-storage';

describe('AuthTokenStorage', () => {
  let storage: AuthTokenStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    storage = TestBed.inject(
      AuthTokenStorage,
    );

    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should store the authentication token', () => {
    storage.set('test-token');

    expect(
      storage.get(),
    ).toBe('test-token');
  });

  it('should return null when no token exists', () => {
    expect(
      storage.get(),
    ).toBeNull();
  });

  it('should remove the authentication token', () => {
    storage.set('test-token');

    storage.remove();

    expect(
      storage.get(),
    ).toBeNull();
  });
});
