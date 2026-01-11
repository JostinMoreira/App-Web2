import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(data: { name: string; email: string }): Promise<{ user: User; isNew: boolean }> {
    const existingUser = await this.repo.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      return { user: existingUser, isNew: false };
    }

    // Si no existe, crear nuevo
    const user = this.repo.create(data);
    const savedUser = await this.repo.save(user);
    return { user: savedUser, isNew: true };
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async markAsReserved(userId: string) {
    const user = await this.repo.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    
    if (!user.active) {
      return false;  // Ya estaba inactivo
    }
    
    user.active = false;
    await this.repo.save(user);
    return true;  // Marcado como reservado exitosamente
  }
}
