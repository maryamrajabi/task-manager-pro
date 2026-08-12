import { Component, signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  form,
  required,
} from '@angular/forms/signals';

import { getTranslocoTestingModule } from '../../../../testing/transloco-testing';

import { AppFormField } from './form-field';

@Component({
  imports: [AppFormField],
  template: `
    <app-form-field
      label="Email address"
      controlId="email"
      [state]="testForm.email()"
    >
      <input id="email" />
    </app-form-field>
  `,
})
class TestHost {
  readonly model = signal({
    email: '',
  });

  readonly testForm = form(this.model, (path) => {
    required(path.email);
  });
}

describe('AppFormField', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHost,
        getTranslocoTestingModule(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should render the label', () => {
    const host = fixture.nativeElement as HTMLElement;

    const label =
      host.querySelector<HTMLLabelElement>('.form-field__label');

    expect(label?.textContent).toContain('Email address');
    expect(label?.htmlFor).toBe('email');
  });

  it('should project the form control', () => {
    const host = fixture.nativeElement as HTMLElement;

    const input =
      host.querySelector<HTMLInputElement>('#email');

    expect(input).not.toBeNull();
  });

  it('should show the required indicator for a required field', () => {
    const host = fixture.nativeElement as HTMLElement;

    const requiredIndicator =
      host.querySelector('.form-field__required');

    expect(requiredIndicator).not.toBeNull();
  });

  it('should not show validation messages before the field is touched', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(
      host.querySelector('app-validation-messages'),
    ).toBeNull();
  });

  it('should show validation messages when the field is touched and invalid', async () => {
    fixture.componentInstance.testForm.email().markAsTouched();

    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    expect(
      host.querySelector('app-validation-messages'),
    ).not.toBeNull();
  });
});
