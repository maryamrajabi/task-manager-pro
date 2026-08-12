import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationError } from '@angular/forms/signals';

import { getTranslocoTestingModule } from '../../../../../testing/transloco-testing';

import { ValidationMessages } from './validation-messages';

describe('ValidationMessages', () => {
  let component: ValidationMessages;
  let fixture: ComponentFixture<ValidationMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ValidationMessages,
        getTranslocoTestingModule(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationMessages);
    component = fixture.componentInstance;

    const errors: ValidationError[] = [
      {
        kind: 'required',
      },
    ];

    fixture.componentRef.setInput('errors', errors);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
