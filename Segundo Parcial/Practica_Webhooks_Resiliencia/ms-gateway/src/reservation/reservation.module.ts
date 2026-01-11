import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReservationController } from './reservation.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESERVATION_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'reservation_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [ReservationController],
})
export class ReservationModule {}
