import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { User } from '../users/entities/user.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingsService } from './bookings.service.js';

/** REST API бронирований (только для авторизованных пользователей). */
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /** Список своих бронирований. */
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.bookingsService.findUserBookings(user.id);
  }

  /** Создание бронирования. */
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(user, dto);
  }

  /** Отмена бронирования. */
  @Delete(':id')
  @HttpCode(204)
  async cancel(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.bookingsService.cancel(user.id, id);
  }
}
