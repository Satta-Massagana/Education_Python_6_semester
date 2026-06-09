import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity.js';
import { CreateWorkshopDto } from './dto/create-workshop.dto.js';
import { UpdateWorkshopDto } from './dto/update-workshop.dto.js';
import { WorkshopResponseDto } from './dto/workshop-response.dto.js';
import { Workshop } from './entities/workshop.entity.js';
import { WorkshopsRepository } from './workshops.repository.js';

/** Бизнес-логика управления мастер-классами. */
@Injectable()
export class WorkshopsService {
  constructor(private readonly workshopsRepository: WorkshopsRepository) {}

  /** Получение списка всех мастер-классов. */
  async findAll(): Promise<WorkshopResponseDto[]> {
    const workshops = await this.workshopsRepository.findAllWithRelations();
    return workshops.map((w) => WorkshopResponseDto.fromEntity(w));
  }

  /** Получение мастер-класса по ID. */
  async findOne(id: number): Promise<WorkshopResponseDto> {
    const workshop = await this.workshopsRepository.findByIdWithRelations(id);
    if (!workshop) {
      throw new NotFoundException('Мастер-класс не найден.');
    }
    return WorkshopResponseDto.fromEntity(workshop);
  }

  /** Создание мастер-класса администратором. */
  async create(
    dto: CreateWorkshopDto,
    user: User,
  ): Promise<WorkshopResponseDto> {
    const workshop = this.workshopsRepository.create({
      title: dto.title,
      description: dto.description,
      date: new Date(dto.date),
      capacity: dto.capacity,
      createdById: user.id,
    });
    const saved = await this.workshopsRepository.save(workshop);
    const full = await this.workshopsRepository.findByIdWithRelations(saved.id);
    return WorkshopResponseDto.fromEntity(full!);
  }

  /** Обновление мастер-класса. */
  async update(
    id: number,
    dto: UpdateWorkshopDto,
  ): Promise<WorkshopResponseDto> {
    const workshop = await this.workshopsRepository.findByIdWithRelations(id);
    if (!workshop) {
      throw new NotFoundException('Мастер-класс не найден.');
    }

    workshop.title = dto.title;
    workshop.description = dto.description;
    workshop.date = new Date(dto.date);
    workshop.capacity = dto.capacity;

    await this.workshopsRepository.save(workshop);
    const updated = await this.workshopsRepository.findByIdWithRelations(id);
    return WorkshopResponseDto.fromEntity(updated!);
  }

  /** Удаление мастер-класса. */
  async remove(id: number): Promise<void> {
    const workshop = await this.workshopsRepository.findByIdWithRelations(id);
    if (!workshop) {
      throw new NotFoundException('Мастер-класс не найден.');
    }
    await this.workshopsRepository.remove(workshop);
  }

  /** Получение сущности с блокировкой (для бронирований). */
  async findByIdForUpdate(id: number): Promise<Workshop | null> {
    return this.workshopsRepository.findByIdForUpdate(id);
  }
}
