import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { ReadonlyFieldState } from '@angular/forms/signals';

import { ValidationMessages } from '@shared/forms/validation';

@Component({
  selector: 'app-form-field',
  imports: [ValidationMessages],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFormField {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();

  readonly state =
    input.required<ReadonlyFieldState<unknown>>();
}
