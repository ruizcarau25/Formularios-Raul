import { AbstractControl, ValidationErrors } from '@angular/forms';

const LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const FORMAT = /^([0-9]{8}[A-Za-z]|[XYZxyz][0-9]{7}[A-Za-z])$/;

export function dniNieLetterValidator(control: AbstractControl): ValidationErrors | null {
  const raw = (control.value ?? '') as string;
  if (!FORMAT.test(raw)) {
    return null;
  }
  const value = raw.toUpperCase();
  const prefix: Record<string, string> = { X: '0', Y: '1', Z: '2' };
  const digits = value.replace(/^[XYZ]/, (l) => prefix[l]).slice(0, -1);
  const expected = LETTERS[Number(digits) % 23];
  return value.slice(-1) === expected ? null : { dniLetter: true };
}
