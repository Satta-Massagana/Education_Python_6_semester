import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { InitialSchema1739000000000 } from './database/migrations/1739000000000-InitialSchema.js';
import { User } from './users/entities/user.entity.js';
import { Workshop } from './workshops/entities/workshop.entity.js';
import { Booking } from './bookings/entities/booking.entity.js';
import { UsersModule } from './users/users.module.js';
import { WorkshopsModule } from './workshops/workshops.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

/** Корневой модуль приложения Workshop Booking System. */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5434', 10),
      username: process.env.POSTGRES_USER || 'booking_user',
      password: process.env.POSTGRES_PASSWORD || 'securepass',
      database: process.env.POSTGRES_DB || 'booking_db',
      entities: [User, Workshop, Booking],
      migrations: [InitialSchema1739000000000],
      migrationsRun: true,
      synchronize: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      // Исключаем API-маршруты из статики (path-to-regexp v8+)
      exclude: ['/api/(.*)'],
    }),
    UsersModule,
    WorkshopsModule,
    BookingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
