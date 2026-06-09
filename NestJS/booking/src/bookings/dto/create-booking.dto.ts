import { IsInt, Min } from 'class-validator';

/** DTO создания бронирования. */
export class CreateBookingDto {
  @IsInt()
  @Min(1)
  workshop_id: number;
}
