import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { WorkshopsRepository } from '../workshops/workshops.repository.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingResponseDto } from './dto/booking-response.dto.js';
import { BookingsRepository } from './bookings.repository.js';

/** Бизнес-логика создания и отмены бронирований. */
@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly workshopsRepository: WorkshopsRepository,
    private readonly dataSource: DataSource,
  ) {}

  /** Список бронирований текущего пользователя. */
  async findUserBookings(userId: number): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingsRepository.findByUserId(userId);
    return bookings.map((b) => BookingResponseDto.fromEntity(b));
  }

  /** Создание бронирования с проверкой вместимости и дублей. */
  async create(user: User, dto: CreateBookingDto): Promise<BookingResponseDto> {
    const savedId = await this.dataSource.transaction(async (manager) => {
      const workshop = await this.workshopsRepository.findByIdForUpdate(
        dto.workshop_id,
        manager,
      );

      if (!workshop) {
        throw new BadRequestException('Мастер-класс не найден.');
      }

      if (new Date(workshop.date).getTime() <= Date.now()) {
        throw new BadRequestException(
          'Нельзя записаться на прошедший мастер-класс.',
        );
      }

      const bookedCount = await this.bookingsRepository.countByWorkshopId(
        dto.workshop_id,
        manager,
      );
      if (bookedCount >= workshop.capacity) {
        throw new BadRequestException('Мастер-класс полностью забронирован.');
      }

      const existing = await this.bookingsRepository.findByUserAndWorkshop(
        user.id,
        dto.workshop_id,
        manager,
      );
      if (existing) {
        throw new BadRequestException('Вы уже записаны на этот мастер-класс.');
      }

      const booking = this.bookingsRepository.create(
        {
          userId: user.id,
          workshopId: dto.workshop_id,
        },
        manager,
      );

      try {
        const saved = await this.bookingsRepository.save(booking, manager);
        return saved.id;
      } catch (error) {
        if (
          error instanceof QueryFailedError &&
          (error as QueryFailedError & { code?: string }).code === '23505'
        ) {
          throw new BadRequestException(
            'Вы уже записаны на этот мастер-класс.',
          );
        }
        throw error;
      }
    });

    const full = await this.bookingsRepository.findByIdWithRelations(savedId);
    if (!full) {
      throw new BadRequestException('Не удалось создать бронирование.');
    }

    return BookingResponseDto.fromEntity(full);
  }

  /** Отмена собственного бронирования. */
  async cancel(userId: number, bookingId: number): Promise<void> {
    const booking = await this.bookingsRepository.findByIdAndUser(
      bookingId,
      userId,
    );

    if (!booking) {
      throw new NotFoundException('Бронирование не найдено.');
    }

    if (new Date(booking.workshop.date).getTime() <= Date.now()) {
      throw new BadRequestException(
        'Нельзя отменить бронирование на прошедший мастер-класс.',
      );
    }

    await this.bookingsRepository.remove(booking);
  }
}
