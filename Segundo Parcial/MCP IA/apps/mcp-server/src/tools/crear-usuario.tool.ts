import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const crearUsuarioTool: MCPTool = {
  name: 'crear_usuario',
  description: 'Crea un nuevo usuario en el sistema. Requiere al menos nombre y email.',
  inputSchema: {
    type: 'object',
    properties: {
      nombre: {
        type: 'string',
        description: 'Nombre completo del usuario',
      },
      email: {
        type: 'string',
        description: 'Correo electrónico del usuario (debe ser único)',
      },
      telefono: {
        type: 'string',
        description: 'Número de teléfono del usuario (opcional)',
      },
    },
    required: ['nombre', 'email'],
  },
  handler: async (args: any, context: { backendClient: BackendClient }): Promise<ToolResult> => {
    try {
      const { nombre, email, telefono } = args;

      // Verificar si el email ya existe
      try {
        const usuariosExistentes = await context.backendClient.get('/usuarios/buscar', { q: email });
        const emailExiste = usuariosExistentes.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (emailExiste) {
          return {
            content: [
              {
                type: 'text',
                text: `El email ${email} ya está registrado en el sistema. Por favor usa otro email.`,
              },
            ],
          };
        }
      } catch (error) {
        // Si falla la búsqueda, continuamos con la creación
      }

      const usuarioData: any = {
        nombre,
        email,
      };

      if (telefono) {
        usuarioData.telefono = telefono;
      }

      const nuevoUsuario = await context.backendClient.post('/usuarios', usuarioData);

      return {
        content: [
          {
            type: 'text',
            text: `Usuario creado exitosamente: ${nuevoUsuario.nombre} (ID: ${nuevoUsuario.id}, Email: ${nuevoUsuario.email}${telefono ? ', Teléfono: ' + nuevoUsuario.telefono : ''}).`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error al crear usuario: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
};
