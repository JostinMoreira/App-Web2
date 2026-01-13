import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const actualizarUsuarioTool: MCPTool = {
  name: 'actualizar_usuario',
  description: 'Actualiza los datos de un usuario existente. Puede actualizar nombre, email o teléfono.',
  inputSchema: {
    type: 'object',
    properties: {
      usuarioId: {
        type: 'number',
        description: 'ID del usuario a actualizar',
      },
      nombre: {
        type: 'string',
        description: 'Nuevo nombre del usuario (opcional)',
      },
      email: {
        type: 'string',
        description: 'Nuevo correo electrónico del usuario (opcional)',
      },
      telefono: {
        type: 'string',
        description: 'Nuevo número de teléfono del usuario (opcional)',
      },
    },
    required: ['usuarioId'],
  },
  handler: async (args: any, context: { backendClient: BackendClient }): Promise<ToolResult> => {
    try {
      const { usuarioId, nombre, email, telefono } = args;

      // Verificar que el usuario existe
      let usuarioActual;
      try {
        usuarioActual = await context.backendClient.get(`/usuarios/${usuarioId}`);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `El usuario con ID ${usuarioId} no existe. Por favor verifica el ID.`,
            },
          ],
        };
      }

      // Construir objeto con solo los campos a actualizar
      const updateData: any = {};
      if (nombre) updateData.nombre = nombre;
      if (email) updateData.email = email;
      if (telefono !== undefined) updateData.telefono = telefono;

      if (Object.keys(updateData).length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No se proporcionaron campos para actualizar. Debes especificar al menos uno: nombre, email o teléfono.',
            },
          ],
        };
      }

      // Si se está actualizando el email, verificar que no exista
      if (email && email !== usuarioActual.email) {
        try {
          const usuariosExistentes = await context.backendClient.get('/usuarios/buscar', { q: email });
          const emailExiste = usuariosExistentes.some(
            (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.id !== usuarioId
          );
          
          if (emailExiste) {
            return {
              content: [
                {
                  type: 'text',
                  text: `El email ${email} ya está registrado por otro usuario. Por favor usa otro email.`,
                },
              ],
            };
          }
        } catch (error) {
          // Si falla la búsqueda, continuamos con la actualización
        }
      }

      const usuarioActualizado = await context.backendClient.patch(`/usuarios/${usuarioId}`, updateData);

      return {
        content: [
          {
            type: 'text',
            text: `Usuario ${usuarioId} actualizado exitosamente: ${usuarioActualizado.nombre} (Email: ${usuarioActualizado.email}${usuarioActualizado.telefono ? ', Teléfono: ' + usuarioActualizado.telefono : ''}).`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al actualizar usuario: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
};
