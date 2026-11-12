import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { dniNieLetterValidator } from './dni-nie.validator';

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const DNI_NIE_PATTERN = /^([0-9]{8}[A-Za-z]|[XYZxyz][0-9]{7}[A-Za-z])$/;
const PHONE_PATTERN = /^(\+34)?[67][0-9]{8}$/;
const USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/;
const POSTAL_CODE_PATTERN = /^(0[1-9][0-9]{3}|[1-4][0-9]{4}|5[0-2][0-9]{3})$/;

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  readonly courses = [
    'Angular',
    'TypeScript',
    'JavaScript',
    'Java',
    'Spring Boot',
    'Python',
  ];

  submittedData: unknown = null;

  readonly form = new FormGroup({
    personal: new FormGroup({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern(NAME_PATTERN),
        ],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(NAME_PATTERN),
        ],
      }),
      documentId: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(DNI_NIE_PATTERN),
          dniNieLetterValidator,
        ],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(PHONE_PATTERN)],
      }),
    }),
    account: new FormGroup({
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
          Validators.pattern(USERNAME_PATTERN),
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(PASSWORD_PATTERN),
        ],
      }),
    }),
    course: new FormGroup({
      selectedCourse: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      weeklyHours: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(2), Validators.max(40)],
      }),
      postalCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(POSTAL_CODE_PATTERN)],
      }),
    }),
    terms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  get personal() {
    return this.form.controls.personal.controls;
  }

  get account() {
    return this.form.controls.account.controls;
  }

  get course() {
    return this.form.controls.course.controls;
  }

  get terms() {
    return this.form.controls.terms;
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  showValid(control: AbstractControl): boolean {
    return control.valid && (control.touched || control.dirty);
  }

  passwordErrors(): string[] {
    const control = this.account.password;
    const value = control.value;
    const errors: string[] = [];

    if (control.errors?.['required']) {
      return ['La contraseña es obligatoria'];
    }
    if (control.errors?.['minlength']) {
      errors.push('Mínimo 8 caracteres');
    }
    if (control.errors?.['maxlength']) {
      errors.push('Máximo 20 caracteres');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('Debe incluir al menos una mayúscula');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('Debe incluir al menos una minúscula');
    }
    if (!/[0-9]/.test(value)) {
      errors.push('Debe incluir al menos un número');
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      errors.push('Debe incluir al menos un carácter especial');
    }
    return errors;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submittedData = null;
      return;
    }

    const value = this.form.getRawValue();
    this.submittedData = {
      personal: {
        ...value.personal,
        documentId: value.personal.documentId.toUpperCase(),
      },
      account: {
        username: value.account.username,
        email: value.account.email,
      },
      course: value.course,
      terms: value.terms,
    };
  }

  onReset(): void {
    this.form.reset({
      personal: { firstName: '', lastName: '', documentId: '', phone: '' },
      account: { username: '', email: '', password: '' },
      course: { selectedCourse: '', weeklyHours: null, postalCode: '' },
      terms: false,
    });
    this.submittedData = null;
  }
}
