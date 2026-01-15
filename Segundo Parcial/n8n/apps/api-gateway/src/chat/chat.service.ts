import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { McpClientService } from '../mcp-client/mcp-client.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly mcpClientService: McpClientService,
  ) {}

  async chat(message: string) {
    try {
      // 1. Get tools
      const tools = await this.mcpClientService.listTools();
      
      // 2. Create model
      const model = this.geminiService.createModelWithTools(tools);

      // 3. Start chat with system context
      const currentDate = new Date().toISOString().split('T')[0];
      const systemContext = [
        {
          role: 'user',
          parts: [{ text: `Contexto del sistema: La fecha actual es ${currentDate} (año ${new Date().getFullYear()}). IMPORTANTE: Todas las fechas deben usar este año actual.` }]
        },
        {
          role: 'model',
          parts: [{ text: `Entendido. Usaré ${currentDate} como referencia y el año ${new Date().getFullYear()} para todas las fechas.` }]
        }
      ];
      const chat = this.geminiService.startChat(model, systemContext);

      // 4. Send message
      this.logger.log(`Usuario: ${message}`);
      let result = await chat.sendMessage(message);
      let response = result.response;
      
      // Loop for tool calls
      while (response.functionCalls() && response.functionCalls().length > 0) {
         const functionCalls = response.functionCalls();
         this.logger.log(`🤖 Gemini solicita ejecutar ${functionCalls.length} funciones`);
         
         const parts = [];
         
         for (const call of functionCalls) {
             const { name, args } = call;
             this.logger.log(`🔧 Ejecutando tool: ${name}`, args);
             
             let toolResultContent: any;
             try {
                 const rawResult = await this.mcpClientService.callTool(name, args);
                 toolResultContent = rawResult;
             } catch (e) {
                 toolResultContent = { error: e.message };
             }

             // Format result for Gemini
             parts.push({
                functionResponse: {
                    name: name,
                    response: { result: toolResultContent }
                }
             });
         }
         
         // Send tool results back to Gemini
         result = await chat.sendMessage(parts);
         response = result.response;
      }

      const text = response.text();
      this.logger.log(`🤖 Respuesta: ${text}`);
      return { response: text };

    } catch (error) {
      this.logger.error('Error en chat:', error);
      throw error;
    }
  }
}
