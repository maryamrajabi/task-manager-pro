import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Observable,
  of,
  throwError,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { vi } from 'vitest';
import { AuthTokenStorage } from '../../storage/auth-token-storage';
import { AuthApiService } from '../../data-access/auth-api.service';
import { getTranslocoTestingModule } from '../../../../../testing/transloco-testing';

import { Login } from './login';

const authApiMock = {
  login: vi.fn(),
};

const tokenStorageMock = {
  set: vi.fn(),
  get: vi.fn(),
  remove: vi.fn(),
};

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;

  beforeEach(async () => {
    authApiMock.login.mockReset();

    tokenStorageMock.set.mockReset();
    tokenStorageMock.get.mockReset();
    tokenStorageMock.remove.mockReset();

    authApiMock.login.mockReturnValue(
      of({
        id: 1,
        fullName: 'Test User',
        email: 'user@example.com',
        token: 'test-token',
      }),
    );

    await TestBed.configureTestingModule({
      imports: [
        Login,
        getTranslocoTestingModule(),
      ],
      providers: [
        {
          provide: AuthApiService,
          useValue: authApiMock,
        },
        {
          provide: AuthTokenStorage,
          useValue: tokenStorageMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid form', () => {
    expect(component.loginForm().invalid()).toBe(true);
  });

  it('should become valid with a valid email and password', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loginForm().valid()).toBe(true);
  });

  it('should keep the form invalid when the password is too short', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: '1234567',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loginForm().invalid()).toBe(true);
  });

  it('should disable the submit button while the form is invalid', () => {
    const host = fixture.nativeElement as HTMLElement;

    const button =
      host.querySelector<HTMLButtonElement>('app-button button');

    expect(button).not.toBeNull();
    expect(button!.disabled).toBe(true);
  });

  it('should enable the submit button when the form is valid', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    const button =
      host.querySelector<HTMLButtonElement>('app-button button');

    expect(button).not.toBeNull();
    expect(button!.disabled).toBe(false);
  });

  it('should bind the Signal Form to the native form element', () => {
    const host = fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    expect(form).not.toBeNull();
    expect(form!.hasAttribute('novalidate')).toBe(true);
  });

  it('should mark invalid fields as touched on submission', async () => {
    const host = fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      component.loginForm.email().touched(),
    ).toBe(true);

    expect(
      component.loginForm.password().touched(),
    ).toBe(true);
  });

  it('should call AuthApiService with the login credentials on valid submission', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await fixture.whenStable();

    expect(authApiMock.login).toHaveBeenCalledTimes(1);

    expect(authApiMock.login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'TestPass123!',
    });
  });

  it('should not call AuthApiService when the form is invalid', async () => {
    const host = fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await fixture.whenStable();

    expect(authApiMock.login).not.toHaveBeenCalled();
  });

  it('should show loading state while login submission is in progress', async () => {
    let resolveLogin!: () => void;

    authApiMock.login.mockReturnValue(
      new Observable((subscriber) => {
        resolveLogin = () => {
          subscriber.next({
            id: 1,
            fullName: 'Test User',
            email: 'user@example.com',
            token: 'test-token',
          });

          subscriber.complete();
        };
      }),
    );

    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    fixture.detectChanges();

    expect(
      component.loginForm().submitting(),
    ).toBe(true);

    const button =
      host.querySelector<HTMLButtonElement>(
        'app-button button',
      );

    expect(button).not.toBeNull();
    expect(button!.disabled).toBe(true);

    expect(
      host.querySelector('.button__spinner'),
    ).not.toBeNull();

    // Simulate the backend response.
    resolveLogin();

    // FormRoot starts submit internally, so wait until
    // Angular finishes the async submission lifecycle.
    await vi.waitFor(() => {
      expect(
        component.loginForm().submitting(),
      ).toBe(false);
    });

    fixture.detectChanges();

    expect(button!.disabled).toBe(false);

    expect(
      host.querySelector('.button__spinner'),
    ).toBeNull();
  });

  it('should show an invalid credentials error when the backend returns 401', async () => {
    authApiMock.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
          }),
      ),
    );

    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host =
      fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(
        component.loginForm()
          .errors()
          .some(
            (error) =>
              error.kind ===
              'invalidCredentials',
          ),
      ).toBe(true);
    });

    fixture.detectChanges();

    const error =
      host.querySelector<HTMLElement>(
        '.auth-error',
      );

    expect(error).not.toBeNull();

    expect(
      error!.textContent?.trim(),
    ).toBe(
      'The email or password is incorrect.',
    );
  });

  it('should clear the submission error when the user changes the form value', async () => {
    authApiMock.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
          }),
      ),
    );

    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host =
      fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(
        component.loginForm()
          .errors()
          .some(
            (error) =>
              error.kind ===
              'invalidCredentials',
          ),
      ).toBe(true);
    });

    component.loginModel.update(
      (model) => ({
        ...model,
        password: 'AnotherPass123!',
      }),
    );

    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(
        component.loginForm()
          .errors()
          .some(
            (error) =>
              error.kind ===
              'invalidCredentials',
          ),
      ).toBe(false);
    });
  });

  it('should show a network error when the backend is unreachable', async () => {
    authApiMock.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 0,
            statusText: 'Unknown Error',
          }),
      ),
    );

    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const form = host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(
        component.loginForm()
          .errors()
          .some((error) => error.kind === 'network'),
      ).toBe(true);
    });

    fixture.detectChanges();

    const error =
      host.querySelector<HTMLElement>('.auth-error');

    expect(error).not.toBeNull();

    expect(error!.textContent?.trim()).toBe(
      'Unable to connect to the server. Please try again.',
    );
  });

  it('should show a server error when the backend returns an unexpected error', async () => {
    authApiMock.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
          }),
      ),
    );

    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const form = host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(
        component.loginForm()
          .errors()
          .some((error) => error.kind === 'server'),
      ).toBe(true);
    });

    fixture.detectChanges();

    const error =
      host.querySelector<HTMLElement>('.auth-error');

    expect(error).not.toBeNull();

    expect(error!.textContent?.trim()).toBe(
      'Something went wrong. Please try again later.',
    );
  });

  it('should complete a successful login without adding submission errors', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host =
      fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(
        component.loginForm().submitting(),
      ).toBe(false);
    });

    fixture.detectChanges();

    expect(authApiMock.login).toHaveBeenCalledTimes(1);

    expect(
      component.loginForm()
        .errors()
        .some((error) =>
          error.kind === 'invalidCredentials' ||
          error.kind === 'network' ||
          error.kind === 'server'
        ),
    ).toBe(false);

    expect(
      host.querySelector('.auth-error'),
    ).toBeNull();
  });

  it('should store the access token after a successful login', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();

    const host =
      fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(
        tokenStorageMock.set,
      ).toHaveBeenCalledTimes(1);
    });

    expect(
      tokenStorageMock.set,
    ).toHaveBeenCalledWith(
      'test-token',
    );
  });

  it('should not store a token when login fails', async () => {
    authApiMock.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
          }),
      ),
    );

    component.loginModel.set({
      email: 'user@example.com',
      password: 'WrongPass123!',
    });

    fixture.detectChanges();

    const host =
      fixture.nativeElement as HTMLElement;

    const form =
      host.querySelector<HTMLFormElement>('form');

    form!.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await vi.waitFor(() => {
      expect(
        component.loginForm()
          .errors()
          .some(
            (error) =>
              error.kind ===
              'invalidCredentials',
          ),
      ).toBe(true);
    });

    expect(
      tokenStorageMock.set,
    ).not.toHaveBeenCalled();
  });

});
