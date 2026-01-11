import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserConsumer {
  constructor(private readonly userService: UserService) {}

  // Listener para CREAR usuarios (desde ms-gateway)
  @EventPattern('user.create')
  async handleUserCreate(
    @Payload() payload: { message_id: string; data: { name: string; email: string } },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log('📥 user.create recibido');
      console.log(`   Message ID: ${payload.message_id}`);
      console.log(`   Nombre: ${payload.data.name}, Email: ${payload.data.email}`);
      
      // Crear con verificación de idempotencia
      const result = await this.userService.create(payload.data);
      
      if (result.isNew) {
        console.log(`✅ Usuario CREADO: ${result.user.id}`);
      } else {
        console.log(`⚠️ Usuario YA EXISTÍA: ${result.user.id} (idempotencia aplicada)`);
      }
      
      channel.ack(originalMsg);
    } catch (error) {
      console.error('❌ Error creando usuario:', error.message);
      channel.ack(originalMsg);
    }
  }

  // Listener para RESERVAR usuarios (desde ms-reservation)
  @EventPattern('reservation.created')
  async handleReservationCreated(
    @Payload() data: { user_id: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log('📥 reservation.created recibido');
      console.log(`   User ID: ${data.user_id}`);
      
      const wasReserved = await this.userService.markAsReserved(data.user_id);
      
      if (wasReserved) {
        console.log('✅ Usuario reservado exitosamente');
      } else {
        console.log('⚠️ Usuario ya estaba reservado (idempotencia aplicada)');
      }
      
      channel.ack(originalMsg);
    } catch (error) {
      console.error('❌ Error procesando reserva:', error.message);
      channel.ack(originalMsg);
    }
  }
}
