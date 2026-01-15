import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return await this.usuariosRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    return await this.usuariosRepository.findOne({ where: { id }, relations: ['reservas'] });
  }

  async buscar(query: string): Promise<Usuario[]> {
    return await this.usuariosRepository.find({
      where: [
        { nombre: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
      ],
    });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuariosRepository.create(data);
    return await this.usuariosRepository.save(usuario);
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    await this.usuariosRepository.update(id, data);
    return await this.findOne(id);
  }
}
