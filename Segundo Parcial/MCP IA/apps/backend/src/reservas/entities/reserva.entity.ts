import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column('text', { nullable: true })
  detalle: string;

  @Column()
  usuarioId: number;

  @ManyToOne('Usuario', (usuario: any) => usuario.reservas)
  @JoinColumn({ name: 'usuarioId' })
  usuario: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
