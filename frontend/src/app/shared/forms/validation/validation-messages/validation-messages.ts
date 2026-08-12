import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';

import { getValidationMessageKey } from '../validation-message-key';

@Component({
  selector: 'app-validation-messages',
  imports: [TranslocoPipe],
  templateUrl: './validation-messages.html',
  styleUrl: './validation-messages.scss',
})
export class ValidationMessages {
  readonly errors =
    input.required<readonly ValidationError[]>();

  messageKey(error: ValidationError): string {
    return getValidationMessageKey(error);
  }
}
