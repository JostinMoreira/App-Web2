import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
  ) {}

  async create(data: Partial<Reserva>): Promise<Reserva> {
    const reserva = this.reservasRepository.create(data);
    return await this.reservasRepository.save(reserva);
  }

  async findAll(): Promise<Reserva[]> {
    return await this.reservasRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Reserva> {
    return await this.reservasRepository.findOne({ where: { id }, relations: ['usuario'] });
  }

  async findByUsuario(usuarioId: number): Promise<Reserva[]> {
    return await this.reservasRepository.find({ where: { usuarioId }, relations: ['usuario'] });
  }

  async update(id: number, data: Partial<Reserva>): Promise<Reserva> {
    await this.reservasRepository.update(id, data);
    return await this.findOne(id);
  }
}
