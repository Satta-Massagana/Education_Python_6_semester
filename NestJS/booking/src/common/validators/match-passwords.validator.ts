import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/** Проверка совпадения двух полей (например, пароль и подтверждение). */
@ValidatorConstraint({ name: 'matchPasswords', async: false })
export class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  validate(_value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const object = args.object as Record<string, string>;
    return object[relatedPropertyName] === object[args.property];
  }

  defaultMessage(): string {
    return 'Пароли не совпадают.';
  }
}

/** Декоратор: значение поля должно совпадать с другим полем DTO. */
export function MatchPasswords(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchPasswordsConstraint,
    });
  };
}
