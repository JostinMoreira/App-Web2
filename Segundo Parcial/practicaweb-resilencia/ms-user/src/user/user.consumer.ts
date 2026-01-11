import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserConsumer {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_users' })
  async getUsers() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(@Payload() id: string) {
    return this.userService.findOne(id);
  }

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

  // Listener para RESERVAS (desde ms-reservation)
  @EventPattern('reservation.created')
  async handleReservationCreated(
    @Payload() payload: { user_id: string; resource_id: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log('📥 reservation.created recibido');
      console.log(`   User ID: ${payload.user_id}`);
      
      await this.userService.processReservation(payload.user_id);
      
      console.log(`✅ Reserva procesada para usuario: ${payload.user_id}`);
      
      channel.ack(originalMsg);
    } catch (error) {
      console.error('❌ Error procesando reserva:', error.message);
      channel.ack(originalMsg);
    }
  }
}