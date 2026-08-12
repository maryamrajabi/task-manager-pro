import { ComponentFixture, TestBed } from '@angular/core/testing';

import { getTranslocoTestingModule } from '../../../../../testing/transloco-testing';

import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Login,
        getTranslocoTestingModule(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid form', () => {
    expect(component.loginForm().invalid()).toBe(true);
  });

  it('should become valid with a valid email and password', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loginForm().valid()).toBe(true);
  });

  it('should keep the form invalid when the password is too short', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: '1234567',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loginForm().invalid()).toBe(true);
  });

  it('should disable the submit button while the form is invalid', () => {
    const host = fixture.nativeElement as HTMLElement;

    const button =
      host.querySelector<HTMLButtonElement>('app-button button');

    expect(button).not.toBeNull();
    expect(button!.disabled).toBe(true);
  });

  it('should enable the submit button when the form is valid', async () => {
    component.loginModel.set({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;

    const button =
      host.querySelector<HTMLButtonElement>('app-button button');

    expect(button).not.toBeNull();
    expect(button!.disabled).toBe(false);
  });
});
