-- Creación de tablas para que el seed funcione al iniciar
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  telefono VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMP NOT NULL,
  estado VARCHAR DEFAULT 'pendiente',
  detalle TEXT,
  "usuarioId" INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario FOREIGN KEY ("usuarioId") REFERENCES usuarios(id)
);

-- Seed data para usuarios
INSERT INTO usuarios (nombre, email, telefono) VALUES
('Juan Pérez', 'juan.perez@email.com', '555-0101'),
('María García', 'maria.garcia@email.com', '555-0102'),
('Carlos López', 'carlos.lopez@email.com', '555-0103'),
('Ana Martínez', 'ana.martinez@email.com', '555-0104'),
('Luis Rodríguez', 'luis.rodriguez@email.com', '555-0105');

-- Seed data para reservas
-- Asumiendo que los IDs de usuarios son 1, 2, 3, 4, 5
INSERT INTO reservas (fecha, estado, detalle, "usuarioId") VALUES
('2023-10-25 10:00:00', 'confirmada', 'Reserva de mesa para 2', 1),
('2023-10-26 14:00:00', 'pendiente', 'Reserva de sala de reuniones', 2),
('2023-10-27 09:00:00', 'cancelada', 'Reserva de equipo', 1),
('2023-10-28 16:30:00', 'confirmada', 'Consultoría', 3),
('2023-10-29 11:15:00', 'pendiente', 'Revisión médica', 4);
