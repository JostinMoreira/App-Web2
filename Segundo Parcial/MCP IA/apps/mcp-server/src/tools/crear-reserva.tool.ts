import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const crearReservaTool: MCPTool = {
  name: 'crear_reserva',
  description: 'Crea una nueva reserva para un usuario existente',
  inputSchema: {
    type: 'object',
    properties: {
      usuarioId: {
        type: 'number',
        description: 'ID del usuario para quien es la reserva',
      },
      fecha: {
        type: 'string',
        description: 'Fecha y hora de la reserva (formato ISO 8601, ej: 2026-01-15 10:00:00). IMPORTANTE: Usa el año actual 2026.',
      },
      detalle: {
        type: 'string',
        description: 'Detalles adicionales de la reserva',
      },
    },
    required: ['usuarioId', 'fecha'],
  },
  handler: async (args: any, context: { backendClient: BackendClient }): Promise<ToolResult> => {
    try {
      const { usuarioId, fecha, detalle } = args;

      // Verificar si el usuario existe
      try {
        await context.backendClient.get(`/usuarios/${usuarioId}`);
      } catch (error) {
         return {
          content: [
            {
              type: 'text',
              text: `El usuario con ID ${usuarioId} no existe. Por favor busca el usuario primero.`,
            },
          ],
        };
      }

      const reservaData = {
        usuarioId,
        fecha,
        detalle,
        estado: 'pendiente'
      };

      const nuevaReserva = await context.backendClient.post('/reservas', reservaData);

      return {
        content: [
          {
            type: 'text',
            text: `Reserva creada exitosamente: ID ${nuevaReserva.id} para la fecha ${nuevaReserva.fecha}. Estado: ${nuevaReserva.estado}.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al crear reserva: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
};

