import { WorkshopResponseDto } from '../../workshops/dto/workshop-response.dto.js';
import { Booking } from '../entities/booking.entity.js';

/** Представление бронирования с вложенным мастер-классом. */
export class BookingResponseDto {
  id: number;
  workshop: WorkshopResponseDto;
  created_at: Date;

  /** Преобразование сущности Booking в DTO ответа. */
  static fromEntity(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      workshop: WorkshopResponseDto.fromEntity(booking.workshop),
      created_at: booking.createdAt,
    };
  }
}
