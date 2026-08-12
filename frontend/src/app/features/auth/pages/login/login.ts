import { Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  minLength,
  required,
} from '@angular/forms/signals';
import {
  provideTranslocoScope,
  TranslocoDirective,
} from '@jsverse/transloco';

import {
  AppButton,
  AppFormField,
  AppInput,
} from '@shared';

interface LoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [
    FormField,
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
  readonly loginModel = signal<LoginFormModel>({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (path) => {
    required(path.email);
    email(path.email);

    required(path.password);
    minLength(path.password, 8);
  });
}
