import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  const port = 3000;
  await app.listen(port);

  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  const mcpServerUrl =
    process.env.MCP_SERVER_URL || 'http://localhost:3001';

  logger.log('');
  logger.log('🌟 ================================================');
  logger.log('🌟 API GATEWAY - ASISTENTE IA DE RESERVAS');
  logger.log('🌟 ================================================');
  logger.log(`🌟 Servidor ejecutándose en: http://localhost:${port}`);
  logger.log(`🌟 MCP Server: ${mcpServerUrl}`);
  logger.log(
    `🌟 Gemini AI: ${geminiConfigured ? '✅ Configurado' : '❌ NO configurado'}`,
  );
  logger.log('🌟 ================================================');
  logger.log('🌟 Endpoint principal:');
  logger.log('🌟   POST /chat');
  logger.log('🌟 ================================================');
  logger.log('🌟 Formato del request:');
  logger.log('🌟   Content-Type: application/json');
  logger.log('🌟   Body: { "message": "Tu consulta aquí" }');
  logger.log('🌟 ================================================');
  logger.log('🌟 Ejemplo:');
  logger.log('🌟   "Quiero reservar una mesa para mañana"');
  logger.log('🌟   "Ver mis reservas pendientes"');
  logger.log('🌟 ================================================');

  if (!geminiConfigured) {
    logger.warn('');
    logger.warn('⚠️  ADVERTENCIA: GEMINI_API_KEY no está configurada');
    logger.warn('⚠️  Obtén tu API Key en: https://aistudio.google.com/');
    logger.warn('⚠️  Configúrala en el archivo .env');
    logger.warn('');
  }

  logger.log('');
}

bootstrap();
