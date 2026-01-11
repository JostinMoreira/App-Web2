import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationService } from './reservation/reservation.service';
import { ReservationController } from './reservation/reservation.controller';
import { Reservation } from './reservation/reservation.entity';
import { IdempotencyGuard } from './idempotency/idempotency.guard';
import { RedisService } from './redis/redis.service';
import { WebhookModule } from './webhook/webhook.module';  
import { WebhookSubscription } from './webhook/entities/webhook-subscription.entity';  
import { WebhookDelivery } from './webhook/entities/webhook-delivery.entity';  
import { WebhookEventEntity } from './webhook/entities/webhook-event.entity';  

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'pguser',
      password: 'pgpass',
      database: 'reservation_db',
      entities: [
        Reservation,
        WebhookSubscription,   
        WebhookDelivery,       
        WebhookEventEntity,    
      ],
      synchronize: true, 
      logging: true,
    }),

    // Entidades para repositorios
    TypeOrmModule.forFeature([Reservation]),

    // Clientes RabbitMQ
    ClientsModule.register([
      {
        name: 'USER_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'user_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'WEBHOOK_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'webhook_queue',
          queueOptions: { durable: true },
        },
      },
    ]),

    // 👇 NUEVO: Módulo de webhooks
    WebhookModule,
  ],
  controllers: [AppController, ReservationController],
  providers: [
    AppService,
    ReservationService,
    IdempotencyGuard,
    RedisService,
  ],
})
export class AppModule {}