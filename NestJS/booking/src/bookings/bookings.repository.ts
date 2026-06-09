import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity.js';

/** Кастомный репозиторий бронирований. */
@Injectable()
export class BookingsRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
  ) {}

  /** Бронирования пользователя с данными мастер-класса (join). */
  findByUserId(userId: number): Promise<Booking[]> {
    return this.repository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.workshop', 'workshop')
      .leftJoinAndSelect('workshop.createdBy', 'createdBy')
      .leftJoinAndSelect('workshop.bookings', 'workshopBookings')
      .where('booking.userId = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC')
      .getMany();
  }

  /** Количество бронирований на мастер-класс. */
  countByWorkshopId(
    workshopId: number,
    manager?: EntityManager,
  ): Promise<number> {
    const repository = manager
      ? manager.getRepository(Booking)
      : this.repository;

    return repository.count({ where: { workshopId } });
  }

  findByUserAndWorkshop(
    userId: number,
    workshopId: number,
    manager?: EntityManager,
  ): Promise<Booking | null> {
    const repository = manager
      ? manager.getRepository(Booking)
      : this.repository;

    return repository.findOne({
      where: { userId, workshopId },
    });
  }

  findByIdAndUser(id: number, userId: number): Promise<Booking | null> {
    return this.repository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.workshop', 'workshop')
      .where('booking.id = :id', { id })
      .andWhere('booking.userId = :userId', { userId })
      .getOne();
  }

  findByIdWithRelations(id: number): Promise<Booking | null> {
    return this.repository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.workshop', 'workshop')
      .leftJoinAndSelect('workshop.createdBy', 'createdBy')
      .leftJoinAndSelect('workshop.bookings', 'workshopBookings')
      .where('booking.id = :id', { id })
      .getOne();
  }

  create(data: Partial<Booking>, manager?: EntityManager): Booking {
    const repository = manager
      ? manager.getRepository(Booking)
      : this.repository;

    return repository.create(data);
  }

  async save(booking: Booking, manager?: EntityManager): Promise<Booking> {
    const repository = manager
      ? manager.getRepository(Booking)
      : this.repository;

    return repository.save(booking);
  }

  async remove(booking: Booking): Promise<void> {
    await this.repository.remove(booking);
  }
}
