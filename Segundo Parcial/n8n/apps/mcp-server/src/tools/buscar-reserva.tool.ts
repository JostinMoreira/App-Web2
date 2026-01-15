import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const buscarReservaTool: MCPTool = {
  name: 'buscar_reserva',
  description: 'Busca reservas por usuario o ID',
  inputSchema: {
    type: 'object',
    properties: {
      usuarioId: {
        type: 'number',
        description: 'ID del usuario para buscar sus reservas',
      },
      reservaId: {
        type: 'number',
        description: 'ID de la reserva específica',
      },
    },
    required: [],
  },
  handler: async (args: any, context: { backendClient: BackendClient }): Promise<ToolResult> => {
    try {
      const { usuarioId, reservaId } = args;

      if (reservaId) {
        const reserva = await context.backendClient.get(`/reservas/${reservaId}`);
        if (!reserva) {
           return {
            content: [{ type: 'text', text: `No se encontró reserva con ID ${reservaId}.` }],
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `Reserva encontrada:\nID: ${reserva.id}\nFecha: ${reserva.fecha}\nEstado: ${reserva.estado}\nDetalle: ${reserva.detalle}\nUsuario: ${reserva.usuario ? reserva.usuario.nombre : 'Desconocido'}`,
            },
          ],
        };
      }

      if (usuarioId) {
        const reservas = await context.backendClient.get(`/reservas/usuario/${usuarioId}`);
         if (!reservas || reservas.length === 0) {
           return {
            content: [{ type: 'text', text: `No se encontraron reservas para el usuario ${usuarioId}.` }],
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `Reservas del usuario ${usuarioId}:\n` +
                reservas.map((r: any) => 
                  `- ID: ${r.id}, Fecha: ${r.fecha}, Estado: ${r.estado}, Detalle: ${r.detalle || 'N/A'}`
                ).join('\n'),
            },
          ],
        };
      }
      
      return {
          content: [{ type: 'text', text: `Por favor proporciona usuarioId o reservaId.` }],
      };

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al buscar reservas: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
};

