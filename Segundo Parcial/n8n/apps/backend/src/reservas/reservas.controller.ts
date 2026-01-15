import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { Reserva } from './entities/reserva.entity';

@Controller('reservas')
export class ReservasController {
  private readonly logger = new Logger(ReservasController.name);

  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  async create(@Body() data: Partial<Reserva>): Promise<Reserva> {
    this.logger.log('POST /reservas', data);
    return await this.reservasService.create(data);
  }

  @Get()
  async findAll(): Promise<Reserva[]> {
    this.logger.log('GET /reservas');
    return await this.reservasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Reserva> {
    this.logger.log(`GET /reservas/${id}`);
    return await this.reservasService.findOne(id);
  }

  @Get('usuario/:id')
  async findByUsuario(@Param('id', ParseIntPipe) id: number): Promise<Reserva[]> {
    this.logger.log(`GET /reservas/usuario/${id}`);
    return await this.reservasService.findByUsuario(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Reserva>,
  ): Promise<Reserva> {
    this.logger.log(`PATCH /reservas/${id}`, data);
    return await this.reservasService.update(id, data);
  }
}
