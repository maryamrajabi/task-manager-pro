import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

export type AppButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButton {
  readonly type = input<AppButtonType>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
}
