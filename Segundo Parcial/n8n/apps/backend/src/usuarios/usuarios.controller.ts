import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('buscar')
  async buscar(@Query('q') query: string): Promise<Usuario[]> {
    this.logger.log(`GET /usuarios/buscar?q=${query}`);
    if (!query || query.trim() === '') {
      return [];
    }
    return await this.usuariosService.buscar(query);
  }

  @Get()
  async findAll(): Promise<Usuario[]> {
    this.logger.log('GET /usuarios');
    return await this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    this.logger.log(`GET /usuarios/${id}`);
    return await this.usuariosService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<Usuario>): Promise<Usuario> {
    this.logger.log('POST /usuarios', data);
    return await this.usuariosService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Usuario>,
  ): Promise<Usuario> {
    this.logger.log(`PATCH /usuarios/${id}`, data);
    return await this.usuariosService.update(id, data);
  }
}
