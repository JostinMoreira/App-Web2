import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  resource_id: string;

  @Column({ default: 'PENDING' })
  status: string;
}
