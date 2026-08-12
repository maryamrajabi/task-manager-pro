import { Component, signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { AppButton } from './button';

@Component({
  imports: [AppButton],
  template: `
    <app-button
      [disabled]="disabled()"
      [loading]="loading()"
    >
      Sign in
    </app-button>
  `,
})
class TestHost {
  readonly disabled = signal(false);
  readonly loading = signal(false);
}

describe('AppButton', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should project button content', () => {
    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector('button');

    expect(button?.textContent).toContain('Sign in');
  });

  it('should disable the native button when disabled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    const button =
      host.querySelector<HTMLButtonElement>('button');

    expect(button?.disabled).toBe(true);
  });

  it('should disable the button while loading', () => {
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    const button =
      host.querySelector<HTMLButtonElement>('button');

    expect(button?.disabled).toBe(true);

    expect(
      host.querySelector('.button__spinner'),
    ).not.toBeNull();
  });
});
