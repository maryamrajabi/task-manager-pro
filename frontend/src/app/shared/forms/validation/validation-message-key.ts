import { ValidationError } from '@angular/forms/signals';

const VALIDATION_MESSAGE_KEYS: Readonly<Record<string, string>> = {
  required: 'validation.required',
  email: 'validation.email',
  minLength: 'validation.minLength',
};

export function getValidationMessageKey(
  error: ValidationError,
): string {
  return (
    VALIDATION_MESSAGE_KEYS[error.kind] ??
    'validation.invalid'
  );
}
