import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationController } from './reservation/reservation.controller';
import { ReservationService } from './reservation/reservation.service';
import { Reservation } from './reservation/reservation.entity';
import { IdempotencyGuard } from './idempotency/idempotency.guard';
import { IdempotencyService } from './idempotency/idempotency.service';
import { Idempotency } from './idempotency/idempotency.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'pguser',
      password: 'pgpass',
      database: 'reservation_db',
      entities: [Reservation, Idempotency],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Reservation, Idempotency]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'user_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AppController, ReservationController],
  providers: [AppService, ReservationService, IdempotencyGuard, IdempotencyService],
})
export class AppModule {}
