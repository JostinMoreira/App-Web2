# MCP Gestor de Reservas IA

Sistema de gestión inteligente de reservas y usuarios utilizando **Model Context Protocol (MCP)** con arquitectura de 3 capas: API Gateway con Chatbot Gemini AI, MCP Server con JSON-RPC, y Backend REST con SQLite.

## 🏗️ Arquitectura

```
Usuario (Postman/Cliente)
    ↓ POST /chat (mensaje de texto)
    
API Gateway NestJS (Puerto 3000)
    ↓ Chat Service gestiona historial
    ↓ Gemini analiza intención del usuario
    ↓ Gemini decide qué tools ejecutar (Function Calling)
    ↓ Ejecuta tools automáticamente vía JSON-RPC
    
MCP Server TypeScript + Express (Puerto 3001)
    ↓ Recibe calls JSON-RPC
    ↓ Ejecuta tools (buscar usuario, crear reserva, etc.)
    ↓ Llama al Backend REST
    
Backend NestJS (Puerto 3002)
    ↓ SQLite database (data/app.db)
    ↓ CRUD usuarios y reservas
```

## ✨ Características Principales

- 🤖 **Chatbot Inteligente** con Gemini AI capaz de entender intenciones naturales.
- 🔧 **Model Context Protocol (MCP)** para estandarizar las herramientas disponibles para la IA.
- 📋 **JSON-RPC 2.0** para la comunicación robusta entre el Gateway y el MCP Server.
- 🎯 **Function Calling** automático: Gemini decide cuándo buscar un usuario o crear una reserva.
- 💾 **Persistencia de Datos**: Usuarios y Reservas almacenados en SQLite.
- 🔍 **Búsqueda Avanzada**: Localización de usuarios por nombre o email.
- ✅ **Gestión de Reservas**: Creación y consulta de reservas vinculadas a usuarios.
- 🚀 **Arquitectura de Microservicios**.

## 📋 Requisitos Previos

- **Node.js** 18+ 
- **npm**
- **Gemini API Key** (gratuita)

## 🔑 Obtener Gemini API Key

1. Visita [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Get API Key"
4. Copia tu API Key

## 📦 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd mcp-ia
```

### 2. Instalar dependencias
Ejecuta el script para instalar dependencias en todos los microservicios:
```bash
npm run install:all
```

### 3. Configurar Variables de Entorno

#### API Gateway (`apps/api-gateway/.env`)
Asegúrate de crear este archivo (o usar `.env.example` como base) y configurar tu API Key:

```env
GEMINI_API_KEY=tu_api_key_aqui
MCP_SERVER_URL=http://localhost:3001
```

#### MCP Server (`apps/mcp-server/.env`)
Opcional, por defecto usa:
```env
BACKEND_URL=http://localhost:3002
DEBUG=true
```

## 🚀 Ejecución

Puedes iniciar todo el entorno de desarrollo con un solo comando (en Windows PowerShell):

```powershell
./start-dev.ps1
```

O iniciar cada servicio manualmente en terminales separadas:

1. **Backend**: `npm run dev:backend` (Puerto 3002)
2. **MCP Server**: `npm run dev:mcp` (Puerto 3001)
3. **API Gateway**: `npm run dev:gateway` (Puerto 3000)

## 🛠️ Herramientas MCP Disponibles

Estas son las herramientas que el modelo de IA puede invocar automáticamente:

| Herramienta | Descripción | Inputs | Resultados |
|---|---|---|---|
| `buscar_usuario` | Busca usuarios en la base de datos. | `query`: Nombre o email (parcial o completo). | Lista de usuarios coincidentes con ID. |
| `crear_reserva` | Crea una reserva para un usuario. | `usuarioId`: ID del usuario.<br>`fecha`: Fecha/hora (ISO).<br>`detalle`: Descripción de la reserva. | Confirmación de reserva creada con ID y estado. |
| `buscar_reserva` | Consulta reservas existentes. | `usuarioId`: ID de usuario.<br>O `reservaId`: ID de reserva. | Detalles de las reservas encontradas. |

## 🧪 Cómo Probar (Ejemplos)

Utiliza Postman o cualquier cliente HTTP para interactuar con el Chatbot.

**Endpoint:** `POST http://localhost:3000/chat`

### Ejemplo 1: Flujo Natural de Creación de Reserva

**Petición 1 (Usuario):**
```json
{
  "message": "Quiero hacer una reserva para Juan Pérez mañana a las 10am para una reunión de proyecto."
}
```

**Respuesta (IA):**
> "He encontrado al usuario Juan Pérez (ID: 1). Procederé a crear la reserva para el 2026-01-07 a las 10:00:00.
> Reserva creada con éxito (ID: 6). Estado: pendiente."

_(Internamente la IA buscó al usuario, obtuvo su ID y luego llamó a la herramienta `crear_reserva`)_

### Ejemplo 2: Consultar Reservas

**Petición:**
```json
{
  "message": "¿Qué reservas tiene María García?"
}
```

**Respuesta (IA):**
> "María García (ID: 2) tiene las siguientes reservas:
> - ID 2: 2023-10-26 14:00 (Reserva de sala de reuniones) - Pendiente"

## 📂 Estructura del Proyecto

```
.
├── apps/
│   ├── api-gateway/      # NestJS + Gemini Client (Chat Logic)
│   ├── backend/          # NestJS + TypeORM + SQLite (Usuarios/Reservas API)
│   └── mcp-server/       # Express + MCP Tools (Intermediario)
├── data/                 # Base de datos SQLite
├── start-dev.ps1         # Script de inicio
└── package.json          # Workspace config
```bash
npm run dev:all
```

Esto inicia los 3 servicios simultáneamente con logs en colores.

### Opción 2: Usar script de shell

#### En Linux/Mac:

```bash
chmod +x start-dev.sh
./start-dev.sh
```

#### En Windows:

```powershell
.\start-dev.ps1
```

### Opción 3: Iniciar manualmente

En 3 terminales diferentes:

```bash
# Terminal 1 - Backend
cd apps/backend
npm run start:dev

# Terminal 2 - MCP Server
cd apps/mcp-server
npm run dev

# Terminal 3 - API Gateway
cd apps/api-gateway
npm run start:dev
```

## 🌐 Endpoints

### API Gateway (Puerto 3000)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/facturas/procesar` | Procesar factura (imagen o PDF) |

### MCP Server (Puerto 3001)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/tools` | Listar tools disponibles |
| POST | `/mcp/tools/list` | Listar tools (JSON-RPC) |
| POST | `/mcp/tools/call` | Ejecutar tool (JSON-RPC) |
| POST | `/tools/:name` | Ejecutar tool (REST debug) |

### Backend (Puerto 3002)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productos` | Listar todos los productos |
| GET | `/productos/buscar?q=...` | Buscar productos |
| GET | `/productos/:id` | Obtener producto por ID |
| POST | `/productos` | Crear producto |
| POST | `/productos/:id/stock` | Actualizar stock |
| GET | `/egresos` | Listar egresos (últimos 50) |
| GET | `/egresos/:id` | Obtener egreso por ID |
| POST | `/egresos` | Crear egreso |

## 📝 Ejemplo de Uso con Postman

### Procesar una Factura

**Request:**

```
POST http://localhost:3000/api/facturas/procesar
Content-Type: multipart/form-data

Body:
- archivo: [seleccionar imagen o PDF de factura]
```

**Response:**

```json
{
  "exito": true,
  "archivo": "factura.jpg",
  "tamano_kb": "245.67",
  "analisis_gemini": "Análisis completado exitosamente...",
  "tools_ejecutadas": 5,
  "tool_calls": [
    {
      "tool": "buscar_producto",
      "args": { "query": "Laptop Dell" },
      "result": { "encontrado": true, "productos": [...] }
    },
    {
      "tool": "validar_stock",
      "args": { "producto_id": 1, "cantidad_requerida": 2 },
      "result": { "disponible": true, "stock_actual": 10 }
    },
    {
      "tool": "crear_egreso",
      "args": { "proveedor": "Tech Store", "fecha": "2024-12-10", ... },
      "result": { "exito": true, "egreso_id": 1, "total": 2400.00 }
    }
  ],
  "egreso_creado": {
    "egreso_id": 1,
    "proveedor": "Tech Store",
    "fecha": "2024-12-10",
    "total": 2400.00,
    "cantidad_productos": 2
  },
  "duracion_segundos": 8.45,
  "timestamp": "2024-12-10T15:30:45.123Z"
}
```

## 🔄 Flujo de Procesamiento

1. **Usuario sube factura** → API Gateway recibe imagen/PDF
2. **API Gateway obtiene tools** → Consulta al MCP Server las tools disponibles
3. **Gemini analiza factura** → Extrae proveedor, fecha, productos, cantidades, precios
4. **Gemini ejecuta tools automáticamente:**
   - `buscar_producto`: Busca cada producto en el inventario
   - `validar_stock`: Verifica disponibilidad de stock
   - `crear_egreso`: Registra el egreso completo
5. **MCP Server ejecuta tools** → Llama al Backend REST para cada operación
6. **Backend procesa datos** → Guarda en SQLite
7. **Respuesta al usuario** → Resultado completo con egreso creado

## 🛠️ Tecnologías Utilizadas

### Backend
- NestJS 10.3+
- TypeORM 0.3+
- SQLite 5.1+

### MCP Server
- TypeScript 5.3+
- Express 4.18+
- Axios 1.6+
- tsx (watch mode)

### API Gateway
- NestJS 10.3+
- @google/generative-ai 0.21+
- Multer (file upload)
- Axios 1.6+

### Herramientas
- JSON-RPC 2.0
- Model Context Protocol (MCP)
- Gemini 2.0 Flash Exp

## 📁 Estructura del Proyecto

```
mcp-inventario-facturas/
├── apps/
│   ├── backend/                    # Backend REST API
│   │   ├── src/
│   │   │   ├── productos/          # Módulo de productos
│   │   │   │   ├── entities/
│   │   │   │   ├── productos.service.ts
│   │   │   │   ├── productos.controller.ts
│   │   │   │   └── productos.module.ts
│   │   │   ├── egresos/            # Módulo de egresos
│   │   │   │   ├── entities/
│   │   │   │   ├── egresos.service.ts
│   │   │   │   ├── egresos.controller.ts
│   │   │   │   └── egresos.module.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── data/                   # Base de datos SQLite
│   │   ├── seed.sql                # Datos de prueba
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── nest-cli.json
│   │
│   ├── mcp-server/                 # MCP Server
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   └── mcp.types.ts    # Definiciones de tipos
│   │   │   ├── tools/              # Tools MCP
│   │   │   │   ├── registry.ts
│   │   │   │   ├── buscar-producto.tool.ts
│   │   │   │   ├── validar-stock.tool.ts
│   │   │   │   └── crear-egreso.tool.ts
│   │   │   ├── services/
│   │   │   │   └── backend-client.ts
│   │   │   ├── utils/
│   │   │   │   └── logger.ts
│   │   │   └── server.ts           # Servidor Express
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api-gateway/                # API Gateway
│       ├── src/
│       │   ├── gemini/             # Integración Gemini
│       │   │   ├── gemini.service.ts
│       │   │   └── gemini.module.ts
│       │   ├── mcp-client/         # Cliente MCP
│       │   │   ├── mcp-client.service.ts
│       │   │   └── mcp-client.module.ts
│       │   ├── facturas/           # Procesamiento facturas
│       │   │   ├── facturas.service.ts
│       │   │   ├── facturas.controller.ts
│       │   │   └── facturas.module.ts
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── .env
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
│
├── package.json                    # Scripts raíz
├── .gitignore
├── start-dev.sh                    # Script Bash
├── start-dev.ps1                   # Script PowerShell
└── README.md
```

## ⚙️ Configuración de Variables de Entorno

### API Gateway

```env
# Requerido
GEMINI_API_KEY=tu_api_key_de_gemini

# Opcional (defaults)
MCP_SERVER_URL=http://localhost:3001
```

### MCP Server

```env
# Opcional (defaults)
BACKEND_URL=http://localhost:3002
DEBUG=true
```

## 🧪 Guía Completa de Pruebas

Esta guía te llevará paso a paso para probar toda la funcionalidad del sistema, desde los servicios individuales hasta el flujo completo end-to-end.

### Paso 0: Verificación Inicial

Antes de comenzar, verifica que los 3 servicios estén ejecutándose correctamente:

```bash
# Verificar Backend (debe responder con status 200)
curl http://localhost:3002/productos

# Verificar MCP Server (debe responder con status: "ok")
curl http://localhost:3001/health

# Verificar API Gateway (debe responder con error de validación, pero confirma que está activo)
curl http://localhost:3000/api/facturas/procesar
```

---

### Paso 1: Probar Backend (Puerto 3002)

#### 1.1 Cargar Datos de Prueba

Si es la primera vez que ejecutas el proyecto, carga los productos de prueba:

```bash
# Opción 1: Usando sqlite3 (si lo tienes instalado)
cd apps/backend
sqlite3 data/inventario.db < seed.sql

# Opción 2: Copiar y pegar el SQL manualmente
# Abre data/inventario.db con cualquier cliente SQLite y ejecuta el contenido de seed.sql
```

#### 1.2 Listar Todos los Productos

```bash
curl http://localhost:3002/productos
```

**Respuesta esperada:**

```json
[
  {
    "id": 1,
    "codigo": "PROD-001",
    "nombre": "Laptop Dell Inspiron 15",
    "descripcion": "Laptop 15 pulgadas, Intel i5, 8GB RAM, 256GB SSD",
    "precio": "1200.00",
    "stock": 10,
    "categoria": "Electrónica",
    "created_at": "2024-12-10T..."
  },
  // ... más productos
]
```

#### 1.3 Buscar Productos

```bash
# Buscar por nombre
curl "http://localhost:3002/productos/buscar?q=laptop"

# Buscar por código
curl "http://localhost:3002/productos/buscar?q=PROD-001"

# Buscar por categoría
curl "http://localhost:3002/productos/buscar?q=audio"
```

**Respuesta esperada:**

```json
[
  {
    "id": 1,
    "codigo": "PROD-001",
    "nombre": "Laptop Dell Inspiron 15",
    "precio": "1200.00",
    "stock": 10
  }
]
```

#### 1.4 Obtener Producto por ID

```bash
curl http://localhost:3002/productos/1
```

#### 1.5 Crear un Nuevo Producto

```bash
curl -X POST http://localhost:3002/productos \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "PROD-999",
    "nombre": "Producto de Prueba",
    "descripcion": "Este es un producto de prueba",
    "precio": 99.99,
    "stock": 5,
    "categoria": "Pruebas"
  }'
```

#### 1.6 Listar Egresos

```bash
# Listar todos los egresos (inicialmente vacío)
curl http://localhost:3002/egresos
```

---

### Paso 2: Probar MCP Server (Puerto 3001)

#### 2.1 Verificar Health Check

```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**

```json
{
  "status": "ok",
  "service": "MCP Server",
  "tools": 3,
  "timestamp": "2024-12-10T..."
}
```

#### 2.2 Listar Tools Disponibles

```bash
curl http://localhost:3001/tools
```

**Respuesta esperada:**

```json
{
  "tools": [
    {
      "name": "buscar_producto",
      "description": "Busca productos en el inventario...",
      "inputSchema": { ... }
    },
    {
      "name": "validar_stock",
      "description": "Valida si hay suficiente stock...",
      "inputSchema": { ... }
    },
    {
      "name": "crear_egreso",
      "description": "Crea un nuevo egreso...",
      "inputSchema": { ... }
    }
  ],
  "count": 3
}
```

#### 2.3 Probar Tool: Buscar Producto (REST Debug)

```bash
curl -X POST http://localhost:3001/tools/buscar_producto \
  -H "Content-Type: application/json" \
  -d '{"query": "laptop"}'
```

**Respuesta esperada:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"encontrado\":true,\"cantidad\":1,\"productos\":[...]}"
    }
  ]
}
```

#### 2.4 Probar Tool: Validar Stock (REST Debug)

```bash
curl -X POST http://localhost:3001/tools/validar_stock \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad_requerida": 2
  }'
```

**Respuesta esperada:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"producto_id\":1,\"stock_actual\":10,\"cantidad_requerida\":2,\"disponible\":true,\"puede_procesar\":true}"
    }
  ]
}
```

#### 2.5 Probar Tool: Crear Egreso (JSON-RPC)

```bash
curl -X POST http://localhost:3001/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "crear_egreso",
      "arguments": {
        "proveedor": "Proveedor Test",
        "fecha": "2024-12-10",
        "detalles": [
          {
            "producto_id": 1,
            "producto_nombre": "Laptop Dell Inspiron 15",
            "cantidad": 2,
            "precio_unitario": 1200.00
          }
        ],
        "observaciones": "Egreso de prueba"
      }
    }
  }'
```

**Respuesta esperada:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"exito\":true,\"egreso_id\":1,\"total\":2400.00,...}"
      }
    ]
  }
}
```

---

### Paso 3: Probar API Gateway - Flujo Completo (Puerto 3000)

#### 3.1 Preparar Factura de Prueba

Para probar el sistema completo, necesitas una imagen de factura. Puedes:

**Opción A: Crear una factura simple en un editor de texto/imagen**

Crea una imagen con el siguiente contenido:

```
FACTURA
Proveedor: Tech Solutions S.A.
Fecha: 10/12/2024

PRODUCTOS:
1. Laptop Dell Inspiron 15 - Cantidad: 2 - Precio: $1,200.00
2. Mouse Logitech M185 - Cantidad: 5 - Precio: $25.50

TOTAL: $2,527.50
```

**Opción B: Usar una factura real escaneada**

Asegúrate de que contenga:
- Nombre del proveedor
- Fecha
- Lista de productos con cantidades y precios

#### 3.2 Procesar Factura con Postman

**Paso a paso:**

1. Abre Postman
2. Crea una nueva request:
   - **Método**: POST
   - **URL**: `http://localhost:3000/api/facturas/procesar`
3. En la pestaña "Body":
   - Selecciona "form-data"
   - Agrega un campo:
     - **Key**: `archivo` (cambia el tipo a "File")
     - **Value**: Selecciona tu imagen de factura
4. Haz clic en "Send"

**Respuesta esperada:**

```json
{
  "exito": true,
  "archivo": "factura.jpg",
  "tamano_kb": "245.67",
  "analisis_gemini": "Análisis completado exitosamente. Se procesaron 2 productos de la factura del proveedor Tech Solutions S.A.",
  "tools_ejecutadas": 5,
  "tool_calls": [
    {
      "tool": "buscar_producto",
      "args": { "query": "Laptop Dell Inspiron 15" },
      "result": {
        "encontrado": true,
        "productos": [
          {
            "id": 1,
            "nombre": "Laptop Dell Inspiron 15",
            "precio": "1200.00",
            "stock": 10
          }
        ]
      }
    },
    {
      "tool": "validar_stock",
      "args": { "producto_id": 1, "cantidad_requerida": 2 },
      "result": {
        "disponible": true,
        "stock_actual": 10,
        "puede_procesar": true
      }
    },
    {
      "tool": "buscar_producto",
      "args": { "query": "Mouse Logitech M185" },
      "result": {
        "encontrado": true,
        "productos": [
          {
            "id": 2,
            "nombre": "Mouse Logitech M185",
            "precio": "25.50",
            "stock": 50
          }
        ]
      }
    },
    {
      "tool": "validar_stock",
      "args": { "producto_id": 2, "cantidad_requerida": 5 },
      "result": {
        "disponible": true,
        "stock_actual": 50,
        "puede_procesar": true
      }
    },
    {
      "tool": "crear_egreso",
      "args": {
        "proveedor": "Tech Solutions S.A.",
        "fecha": "2024-12-10",
        "detalles": [
          {
            "producto_id": 1,
            "producto_nombre": "Laptop Dell Inspiron 15",
            "cantidad": 2,
            "precio_unitario": 1200.00
          },
          {
            "producto_id": 2,
            "producto_nombre": "Mouse Logitech M185",
            "cantidad": 5,
            "precio_unitario": 25.50
          }
        ]
      },
      "result": {
        "exito": true,
        "egreso_id": 1,
        "total": 2527.50
      }
    }
  ],
  "egreso_creado": {
    "egreso_id": 1,
    "proveedor": "Tech Solutions S.A.",
    "fecha": "2024-12-10",
    "total": 2527.50,
    "cantidad_productos": 2
  },
  "duracion_segundos": 8.45,
  "timestamp": "2024-12-10T15:30:45.123Z"
}
```

#### 3.3 Procesar Factura con curl

```bash
# Asegúrate de tener una imagen de factura (por ejemplo: factura.jpg)
curl -X POST http://localhost:3000/api/facturas/procesar \
  -F "archivo=@/ruta/a/tu/factura.jpg"
```

#### 3.4 Validar Resultados

Después de procesar la factura, verifica que el egreso se creó correctamente:

```bash
# Listar todos los egresos
curl http://localhost:3002/egresos

# Obtener el egreso específico (usa el egreso_id de la respuesta)
curl http://localhost:3002/egresos/1
```

**Respuesta esperada:**

```json
{
  "id": 1,
  "proveedor": "Tech Solutions S.A.",
  "fecha": "2024-12-10",
  "total": "2527.50",
  "detalles": [
    {
      "producto_id": 1,
      "producto_nombre": "Laptop Dell Inspiron 15",
      "cantidad": 2,
      "precio_unitario": 1200.00,
      "subtotal": 2400.00
    },
    {
      "producto_id": 2,
      "producto_nombre": "Mouse Logitech M185",
      "cantidad": 5,
      "precio_unitario": 25.50,
      "subtotal": 127.50
    }
  ],
  "observaciones": null,
  "created_at": "2024-12-10T..."
}
```

---

### Casos de Prueba Adicionales

#### Caso 1: Factura con Producto No Encontrado

Crea una factura con un producto que no existe en el inventario (ej: "iPhone 15 Pro").

**Comportamiento esperado:**
- Gemini intentará buscar el producto
- No encontrará coincidencias
- Informará en el análisis que el producto no pudo ser procesado

#### Caso 2: Factura con Stock Insuficiente

Crea una factura solicitando más unidades de las disponibles en stock.

**Comportamiento esperado:**
- Gemini buscará el producto (exitoso)
- Validará el stock (fallará)
- Informará que no hay stock suficiente

#### Caso 3: Factura con Múltiples Productos

Crea una factura con 5-10 productos diferentes.

**Comportamiento esperado:**
- Gemini procesará cada producto secuencialmente
- Ejecutará buscar_producto y validar_stock para cada uno
- Creará un egreso con todos los productos válidos

---

### Tips para Testing

1. **Monitorear los Logs**: Mantén visibles las 3 terminales para ver el flujo de datos en tiempo real.

2. **Verificar la Base de Datos**: Puedes abrir `apps/backend/data/inventario.db` con cualquier cliente SQLite para inspeccionar los datos directamente.

3. **Probar con Facturas Reales**: El sistema funciona mejor con facturas reales escaneadas que contengan estructura clara.

4. **Formato de Fecha**: Gemini es flexible con formatos de fecha (DD/MM/YYYY, YYYY-MM-DD, etc.) y los convertirá automáticamente.

5. **Calidad de Imagen**: Para mejores resultados, usa imágenes claras con buena resolución (mínimo 800x600px).

6. **Tipos de Archivo**: Puedes probar con JPG, PNG, o PDF.

7. **Limpiar Base de Datos**: Si quieres empezar de cero:
   ```bash
   cd apps/backend
   rm data/inventario.db
   # Reinicia el backend para que TypeORM cree las tablas nuevamente
   # Luego ejecuta el seed.sql
   ```

8. **Debug Mode**: Si algo no funciona, activa el modo debug en el MCP Server editando `apps/mcp-server/.env`:
   ```env
   DEBUG=true
   ```

---

### Verificación Final

Si completaste todos los pasos exitosamente, deberías tener:

- ✅ Backend respondiendo en puerto 3002
- ✅ MCP Server respondiendo en puerto 3001 con 3 tools registradas
- ✅ API Gateway respondiendo en puerto 3000
- ✅ Productos cargados en la base de datos
- ✅ Al menos un egreso creado mediante el procesamiento de factura
- ✅ Logs detallados en las 3 terminales mostrando el flujo completo

**¡El sistema está completamente funcional! 🎉**

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY no está configurada"

Asegúrate de crear el archivo `.env` en `apps/api-gateway/` con tu API Key.

### Error: "No se pudo conectar con el MCP Server"

Verifica que el MCP Server esté ejecutándose en el puerto 3001.

### Error: "Backend no disponible"

Verifica que el Backend esté ejecutándose en el puerto 3002.

### Los puertos ya están en uso

Cambia los puertos en los archivos `main.ts` de cada servicio.

## 📄 Licencia

MIT

## 👨‍💻 Autor

Proyecto educativo para demostrar la arquitectura MCP con Gemini AI.

---

**¡Disfruta procesando facturas con IA! 🚀**
