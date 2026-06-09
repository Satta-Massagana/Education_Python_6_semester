import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Workshop } from '../../workshops/entities/workshop.entity.js';

/** Бронирование пользователя на мастер-класс. */
@Entity('bookings')
@Unique('unique_user_workshop_booking', ['userId', 'workshopId'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'workshop_id' })
  workshopId: number;

  @ManyToOne(() => Workshop, (workshop) => workshop.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
