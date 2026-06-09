import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';
import { Booking } from '../bookings/entities/booking.entity.js';
import { InitialSchema1739000000000 } from './migrations/1739000000000-InitialSchema.js';

/** DataSource для CLI TypeORM (миграции). */
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5434', 10),
  username: process.env.POSTGRES_USER || 'booking_user',
  password: process.env.POSTGRES_PASSWORD || 'securepass',
  database: process.env.POSTGRES_DB || 'booking_db',
  entities: [User, Workshop, Booking],
  migrations: [InitialSchema1739000000000],
});
