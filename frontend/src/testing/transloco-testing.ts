import { TranslocoTestingModule } from '@jsverse/transloco';

export function getTranslocoTestingModule() {
  return TranslocoTestingModule.forRoot({
    langs: {
      en: {
        validation: {
          required: 'This field is required.',
          email: 'Please enter a valid email address.',
          minLength: 'This value is too short.',
          invalid: 'Please check this value.',
        },
      },

      'auth/en': {
        login: {
          eyebrow: 'Task Manager Pro',
          title: 'Welcome back',
          description:
            'Sign in to manage your tasks and stay focused.',
          emailLabel: 'Email address',
          emailPlaceholder: 'you@example.com',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter your password',
          submit: 'Sign in',
          errors: {
            invalidCredentials: 'The email or password is incorrect.',
            network: 'Unable to connect to the server. Please try again.',
            server: 'Something went wrong. Please try again later.',
          },
        },
      },
    },

    translocoConfig: {
      availableLangs: ['en'],
      defaultLang: 'en',
      reRenderOnLangChange: false,
    },

    preloadLangs: true,
  });
}
