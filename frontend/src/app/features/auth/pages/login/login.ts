import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';
import {
  provideTranslocoScope,
  TranslocoDirective,
} from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AppButton,
  AppFormField,
  AppInput,
} from '@shared';

import { AuthApiService } from '../../data-access/auth-api.service';

interface LoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    FormRoot,
    TranslocoDirective,
    AppInput,
    AppButton,
    AppFormField,
  ],
  providers: [
    provideTranslocoScope('auth'),
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authApi = inject(AuthApiService);

  readonly loginModel = signal<LoginFormModel>({
    email: '',
    password: '',
  });

  readonly loginForm = form(
    this.loginModel,

    (path) => {
      required(path.email);
      email(path.email);

      required(path.password);
      minLength(path.password, 8);
    },

    {
      submission: {
        action: async (field) => {
          try {
            const response = await firstValueFrom(
              this.authApi.login(
                field().value(),
              ),
            );
            return;
          } catch (error) {
            if (
              error instanceof HttpErrorResponse &&
              error.status === 401
            ) {
              return {
                kind: 'invalidCredentials',
              };
            }

            if (
              error instanceof HttpErrorResponse &&
              error.status === 0
            ) {
              return {
                kind: 'network',
              };
            }

            return {
              kind: 'server',
            };
          }
        },
      },
    },
  );

  readonly loginErrorKey = computed(() => {
    const error = this.loginForm()
      .errors()
      .find((item) =>
        item.kind === 'invalidCredentials' ||
        item.kind === 'network' ||
        item.kind === 'server'
      );

    switch (error?.kind) {
      case 'invalidCredentials':
        return 'auth.login.errors.invalidCredentials';

      case 'network':
        return 'auth.login.errors.network';

      case 'server':
        return 'auth.login.errors.server';

      default:
        return null;
    }
  });

}
