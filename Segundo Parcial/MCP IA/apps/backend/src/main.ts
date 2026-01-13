import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  const port = 3002;
  await app.listen(port);

  logger.log('');
  logger.log('🚀 ================================================');
  logger.log('🚀 BACKEND REST API - GESTIÓN DE RESERVAS');
  logger.log('🚀 ================================================');
  logger.log(`🚀 Servidor ejecutándose en: http://localhost:${port}`);
  logger.log('🚀 ================================================');
  logger.log('🚀 Endpoints de Usuarios:');
  logger.log('🚀   GET    /usuarios              - Listar usuarios');
  logger.log('🚀   GET    /usuarios/buscar?q=... - Buscar usuarios');
  logger.log('🚀   GET    /usuarios/:id          - Obtener usuario');
  logger.log('🚀   POST   /usuarios              - Crear usuario');
  logger.log('🚀   PATCH  /usuarios/:id          - Actualizar usuario');
  logger.log('🚀 ================================================');
  logger.log('🚀 Endpoints de Reservas:');
  logger.log('🚀   GET    /reservas              - Listar reservas');
  logger.log('🚀   GET    /reservas/:id          - Obtener reserva');
  logger.log('🚀   GET    /reservas/usuario/:id  - Reservas por usuario');
  logger.log('🚀   POST   /reservas              - Crear reserva');
  logger.log('🚀   PATCH  /reservas/:id          - Actualizar reserva');
  logger.log('🚀 ================================================');
  logger.log('');
}

bootstrap();
