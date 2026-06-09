import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkshopsModule } from '../workshops/workshops.module.js';
import { Booking } from './entities/booking.entity.js';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { BookingsRepository } from './bookings.repository.js';

/** Модуль бронирований. */
@Module({
  imports: [TypeOrmModule.forFeature([Booking]), WorkshopsModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository],
})
export class BookingsModule {}
