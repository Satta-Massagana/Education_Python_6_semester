import { IsInt, IsString, Min, MinLength } from 'class-validator';
import { IsFutureDate } from '../../common/validators/is-future-date.validator.js';

/** DTO создания мастер-класса. */
export class CreateWorkshopDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsFutureDate()
  date: string;

  @IsInt()
  @Min(1)
  capacity: number;
}
