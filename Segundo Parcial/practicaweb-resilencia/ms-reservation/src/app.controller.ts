import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ReservationService } from './reservation/reservation.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reservationService: ReservationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('reservations')
  async getReservations() {
    return this.reservationService.findAll();
  }

  @Get('reservations/:id')
  async getReservation(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }
}
