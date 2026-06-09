import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum.js';
import { Booking } from '../../bookings/entities/booking.entity.js';
import { Workshop } from '../../workshops/entities/workshop.entity.js';

/** Пользователь системы с ролью admin или user. */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 150 })
  username: string;

  @Column({ unique: true })
  email: string;

  /** Хеш пароля (никогда не отдаётся в API). */
  @Column({ select: false })
  password: string;

  @Column({ type: 'varchar', length: 10, default: UserRole.USER })
  role: UserRole;

  @Column({ name: 'first_name', nullable: true, length: 150 })
  firstName: string;

  @Column({ name: 'last_name', nullable: true, length: 150 })
  lastName: string;

  @OneToMany(() => Workshop, (workshop) => workshop.createdBy)
  createdWorkshops: Workshop[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
