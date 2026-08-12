import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

export type AppInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppInput implements FormValueControl<string> {
  // Required by FormValueControl
  readonly value = model('');

  // UI configuration
  readonly id = input.required<string>();
  readonly type = input<AppInputType>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string | null>(null);

  // Form state received automatically through [formField]
  readonly touched = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly invalid = input(false);
  readonly required = input(false);
  readonly minLength = input<number | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);

  // Signal Forms uses blur/touch information
  readonly touch = output<void>();

  private readonly inputElement =
    viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.value.set(element.value);
  }

  focus(options?: FocusOptions): void {
    this.inputElement().nativeElement.focus(options);
  }
}
