import { Workshop } from '../entities/workshop.entity.js';

/** Представление мастер-класса в ответах API. */
export class WorkshopResponseDto {
  id: number;
  title: string;
  description: string;
  date: Date;
  capacity: number;
  available_seats: number;
  is_full: boolean;
  is_past: boolean;
  created_by_username: string | null;
  created_at: Date;
  updated_at: Date;

  /** Преобразование сущности Workshop в DTO с вычисляемыми полями. */
  static fromEntity(workshop: Workshop): WorkshopResponseDto {
    const bookedCount = workshop.bookings?.length ?? 0;
    const availableSeats = Math.max(0, workshop.capacity - bookedCount);
    const isPast = new Date(workshop.date).getTime() <= Date.now();

    return {
      id: workshop.id,
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      capacity: workshop.capacity,
      available_seats: availableSeats,
      is_full: availableSeats === 0,
      is_past: isPast,
      created_by_username: workshop.createdBy?.username ?? null,
      created_at: workshop.createdAt,
      updated_at: workshop.updatedAt,
    };
  }
}
