import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const actualizarReservaTool: MCPTool = {
  name: 'actualizar_reserva',
  description: 'Actualiza el estado u otros detalles de una reserva existente. Útil para cambiar el estado de pendiente a confirmada, cancelada, etc.',
  inputSchema: {
    type: 'object',
    properties: {
      reservaId: {
        type: 'number',
        description: 'ID de la reserva a actualizar',
      },
      estado: {
        type: 'string',
        description: 'Nuevo estado de la reserva (pendiente, confirmada, cancelada, completada)',
        enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      },
      fecha: {
        type: 'string',
        description: 'Nueva fecha y hora de la reserva (formato ISO 8601, opcional)',
      },
      detalle: {
        type: 'string',
        description: 'Nuevos detalles de la reserva (opcional)',
      },
    },
    required: ['reservaId'],
  },
  handler: async (args: any, context: { backendClient: BackendClient }): Promise<ToolResult> => {
    try {
      const { reservaId, estado, fecha, detalle } = args;

      // Verificar que la reserva existe
      let reservaActual;
      try {
        reservaActual = await context.backendClient.get(`/reservas/${reservaId}`);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `La reserva con ID ${reservaId} no existe. Por favor verifica el ID.`,
            },
          ],
        };
      }

      // Construir objeto con solo los campos a actualizar
      const updateData: any = {};
      if (estado) updateData.estado = estado;
      if (fecha) updateData.fecha = fecha;
      if (detalle) updateData.detalle = detalle;

      if (Object.keys(updateData).length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No se proporcionaron campos para actualizar. Debes especificar al menos uno: estado, fecha o detalle.',
            },
          ],
        };
      }

      const reservaActualizada = await context.backendClient.patch(`/reservas/${reservaId}`, updateData);

      return {
        content: [
          {
            type: 'text',
            text: `Reserva ${reservaId} actualizada exitosamente. Estado: ${reservaActualizada.estado}, Fecha: ${reservaActualizada.fecha}, Usuario: ${reservaActualizada.usuario?.nombre || 'N/A'}.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al actualizar reserva: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
};
