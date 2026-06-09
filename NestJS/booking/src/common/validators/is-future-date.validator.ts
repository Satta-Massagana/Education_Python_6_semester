import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/** Проверка, что дата находится в будущем. */
@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string | Date): boolean {
    if (!value) {
      return false;
    }
    const date = value instanceof Date ? value : new Date(value);
    return date.getTime() > Date.now();
  }

  defaultMessage(): string {
    return 'Дата мастер-класса должна быть в будущем.';
  }
}

/** Декоратор валидации будущей даты. */
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}
