import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStorage {
  private readonly storageKey =
    'task-manager-pro.access-token';

  set(token: string): void {
    sessionStorage.setItem(
      this.storageKey,
      token,
    );
  }

  get(): string | null {
    return sessionStorage.getItem(
      this.storageKey,
    );
  }

  remove(): void {
    sessionStorage.removeItem(
      this.storageKey,
    );
  }
}
