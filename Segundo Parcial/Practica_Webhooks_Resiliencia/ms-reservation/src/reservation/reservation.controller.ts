import { Controller, Inject, Post, Body } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  ClientProxy,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { IdempotencyGuard } from '../idempotency/idempotency.guard';
import { ReservationService } from './reservation.service';
import { ReservationCompletedEvent } from '../events/reservation-completed.event';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly idempotencyGuard: IdempotencyGuard,
    private readonly reservationService: ReservationService,
    @Inject('USER_PUBLISHER') private readonly userClient: ClientProxy,
    @Inject('WEBHOOK_PUBLISHER') private readonly webhookClient: ClientProxy,
  ) {}

  @Post()
  async createReservation(@Body() body: { user_id: string; resource_name: string }) {
    const reservation = await this.reservationService.createReservation(body);
    this.userClient.emit('reservation.created', { user_id: body.user_id });
    return reservation;
  }

  @EventPattern('reservation.request')
  async handle(@Payload() payload: any, @Ctx() context: RmqContext) {
    console.log('📥 Procesando reservation.request...');
    console.log('   Message ID:', payload.message_id);
    
    const channel = context.getChannelRef();
    const msg = context.getMessage();

    await this.idempotencyGuard.run(payload.message_id, async () => {
      // 1. Crear reserva en BD
      const reservation = await this.reservationService.createReservation(payload.data);
      
      console.log('✅ Reserva creada:', reservation.id);

      // 2. Emitir evento a ms-user (flujo existente)
      this.userClient.emit('reservation.created', payload.data);

      // 3. Crear y emitir evento webhook
      const webhookEvent: ReservationCompletedEvent = {
        event_id: uuidv4(),
        event_type: 'reservation.completed',
        timestamp: new Date().toISOString(),
        idempotency_key: payload.message_id,
        payload: {
          reservation_id: reservation.id,
          user_id: reservation.user_id,
          resource_name: reservation.resource_name,
          reserved_at: reservation.created_at.toISOString(),
        },
      };

      this.webhookClient.emit('webhook.publish', webhookEvent);
      
      console.log('📤 Evento webhook emitido:', webhookEvent.event_id);
    });

    channel.ack(msg);
  }
}
