import { Controller, Inject, Post, Body } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
  ClientProxy,
} from '@nestjs/microservices';
import { IdempotencyGuard } from '../idempotency/idempotency.guard';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly idempotencyGuard: IdempotencyGuard,
    private readonly reservationService: ReservationService,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'get_reservations' })
  async getReservations() {
    return this.reservationService.findAll();
  }

  @MessagePattern({ cmd: 'get_reservation' })
  async getReservation(@Payload() id: string) {
    return this.reservationService.findOne(id);
  }

  @Post()
  async createReservation(@Body() body: { user_id: string; resource_id: string }) {
    const reservation = await this.reservationService.createReservation(body);
    this.client.emit('reservation.created', { user_id: body.user_id, resource_id: body.resource_id });
    return reservation;
  }

  @EventPattern('reservation.request')
  async handle(@Payload() payload: any, @Ctx() context: RmqContext) {
    console.log('📥 Procesando reservation.request...');
    
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    await this.idempotencyGuard.run(payload.message_id, async () => {
      await this.reservationService.createReservation(payload.data);
      this.client.emit('reservation.created', payload.data);
      console.log('✅ Reserva creada y evento emitido a ms-user');
    });

    channel.ack(msg);
  }
}
