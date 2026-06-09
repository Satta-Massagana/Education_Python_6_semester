import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Workshop } from './entities/workshop.entity.js';

/** Кастомный репозиторий с QueryBuilder для оптимизации запросов. */
@Injectable()
export class WorkshopsRepository {
  constructor(
    @InjectRepository(Workshop)
    private readonly repository: Repository<Workshop>,
  ) {}

  /** Список мастер-классов с join (борьба с N+1). */
  findAllWithRelations(): Promise<Workshop[]> {
    return this.repository
      .createQueryBuilder('workshop')
      .leftJoinAndSelect('workshop.createdBy', 'createdBy')
      .leftJoinAndSelect('workshop.bookings', 'bookings')
      .orderBy('workshop.date', 'ASC')
      .getMany();
  }

  /** Детали мастер-класса с связанными данными. */
  findByIdWithRelations(id: number): Promise<Workshop | null> {
    return this.repository
      .createQueryBuilder('workshop')
      .leftJoinAndSelect('workshop.createdBy', 'createdBy')
      .leftJoinAndSelect('workshop.bookings', 'bookings')
      .where('workshop.id = :id', { id })
      .getOne();
  }

  /** Блокировка записи для проверки вместимости при бронировании. */
  findByIdForUpdate(
    id: number,
    manager?: EntityManager,
  ): Promise<Workshop | null> {
    const repository = manager
      ? manager.getRepository(Workshop)
      : this.repository;

    // Без JOIN: PostgreSQL не поддерживает FOR UPDATE с outer join
    return repository
      .createQueryBuilder('workshop')
      .where('workshop.id = :id', { id })
      .setLock('pessimistic_write')
      .getOne();
  }

  create(data: Partial<Workshop>): Workshop {
    return this.repository.create(data);
  }

  async save(workshop: Workshop): Promise<Workshop> {
    return this.repository.save(workshop);
  }

  async remove(workshop: Workshop): Promise<void> {
    await this.repository.remove(workshop);
  }
}
