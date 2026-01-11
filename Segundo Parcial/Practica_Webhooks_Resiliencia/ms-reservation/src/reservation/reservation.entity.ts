import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  resource_name: string;

  @Column({ default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
