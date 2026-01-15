import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const buscarUsuarioTool: MCPTool = {
  name: 'buscar_usuario',
  description: 'Busca usuarios en la base de datos por nombre o email',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Término de búsqueda (nombre, email o parte de ellos)',
      },
    },
    required: ['query'],
  },
  handler: async (args: any, context: { backendClient: BackendClient }): Promise<ToolResult> => {
    try {
      const { query } = args;
      // Use existing client method if possible or adjust to use generic request if needed
      // Assuming context.backendClient.get is available and returns data directly as seen in previous read
      const usuarios = await context.backendClient.get('/usuarios/buscar', { q: query });

      if (!usuarios || usuarios.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No se encontraron usuarios que coincidan con "${query}".`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Se encontraron ${usuarios.length} usuarios:\n` +
              usuarios.map((u: any) => 
                `- ID: ${u.id}, Nombre: ${u.nombre}, Email: ${u.email}, Teléfono: ${u.telefono || 'N/A'}`
              ).join('\n'),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al buscar usuarios: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
};

