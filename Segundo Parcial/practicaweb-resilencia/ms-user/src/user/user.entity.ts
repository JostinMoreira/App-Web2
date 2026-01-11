import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Sin nombre' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  active: boolean;
}
