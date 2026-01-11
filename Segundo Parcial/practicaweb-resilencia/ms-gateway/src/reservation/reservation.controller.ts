import { Controller, Post, Body, Inject, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Controller('reservations')
export class ReservationController {
  constructor(
    @Inject('RESERVATION_PUBLISHER') private readonly reservationClient: ClientProxy,
  ) {}

  @Get()
  async getReservations() {
    return this.reservationClient.send({ cmd: 'get_reservations' }, {});
  }

  @Get(':id')
  async getReservation(@Param('id') id: string) {
    return this.reservationClient.send({ cmd: 'get_reservation' }, id);
  }


  @Post()
  async createReservation(@Body() body: { user_id: string; resource_id: string }) {
    const message_id = uuidv4();

    this.reservationClient.emit('reservation.request', {
      message_id,
      data: body,
    });

    console.log(`📤 PUBLISHED reservation.request - message_id: ${message_id}`);

    return { message: 'Reservation request sent', message_id };
  }
}
