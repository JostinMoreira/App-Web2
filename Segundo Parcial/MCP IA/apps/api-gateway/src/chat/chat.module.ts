import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiModule } from '../gemini/gemini.module';
import { McpClientModule } from '../mcp-client/mcp-client.module';

@Module({
  imports: [GeminiModule, McpClientModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
