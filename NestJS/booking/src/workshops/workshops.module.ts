import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity.js';
import { WorkshopsController } from './workshops.controller.js';
import { WorkshopsService } from './workshops.service.js';
import { WorkshopsRepository } from './workshops.repository.js';

/** Модуль мастер-классов. */
@Module({
  imports: [TypeOrmModule.forFeature([Workshop])],
  controllers: [WorkshopsController],
  providers: [WorkshopsService, WorkshopsRepository],
  exports: [WorkshopsService, WorkshopsRepository],
})
export class WorkshopsModule {}
