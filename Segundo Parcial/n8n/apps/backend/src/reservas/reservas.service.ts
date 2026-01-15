import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
  ) {}

  async create(data: Partial<Reserva>): Promise<Reserva> {
    const reserva = this.reservasRepository.create(data);
    const saved = await this.reservasRepository.save(reserva);

    // Obtener datos completos para el webhook
    const fullReserva = await this.findOne(saved.id);
    this.emitWebhook(fullReserva).catch((err) =>
      console.error('Error enviando webhook:', err.message),
    );

    return saved;
  }

  private async emitWebhook(reserva: Reserva, eventType = 'reserva.creada') {
    const payload = {
      event: eventType,
      data: {
        reserva_id: reserva.id,
        usuario: reserva.usuario?.nombre || 'Usuario Desconocido',
        detalle: reserva.detalle,
        libro: reserva.detalle, // Compatibilidad con workflows antiguos
        fecha: reserva.fecha,
        email: reserva.usuario?.email,
        status: reserva.estado,
      },
      timestamp: new Date().toISOString(),
    };

    // Notificar a los 3 workflows de n8n
    const webhooks = [
      //'https://r2ds1fr4-5678.use.devtunnels.ms/webhook-test/reserva-workflow',
      //'https://r2ds1fr4-5678.use.devtunnels.ms/webhook-test/sheets-sync-reservas',
      'https://r2ds1fr4-5678.use.devtunnels.ms/webhook-test/alertas-reserva-workflow',
    ];

    const results = await Promise.allSettled(
      webhooks.map((url) => {
        const username = process.env.N8N_USER || 'admin';
        const password = process.env.N8N_PASSWORD || 'uleam2025';
        const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

        return fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify(payload),
        }).then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            
            // Detección específica para DevTunnels
            const authHeader = res.headers.get('www-authenticate');
            if (authHeader && authHeader.includes('tunnel')) {
               throw new Error(`Status ${res.status}: Bloqueado por DevTunnel. Por favor, haz el túnel PÚBLICO (Anonymous access).`);
            }
            
            throw new Error(`Status ${res.status}: ${text}`);
          }
          return res;
        });
      }),
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Webhook ${webhooks[index]} falló:`, result.reason);
      } else {
        console.log(`Webhook ${webhooks[index]} enviado correctamente.`);
      }
    });
  }

  async findAll(): Promise<Reserva[]> {
    return await this.reservasRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Reserva> {
    return await this.reservasRepository.findOne({ where: { id }, relations: ['usuario'] });
  }

  async findByUsuario(usuarioId: number): Promise<Reserva[]> {
    return await this.reservasRepository.find({ where: { usuarioId }, relations: ['usuario'] });
  }

  async update(id: number, data: Partial<Reserva>): Promise<Reserva> {
    await this.reservasRepository.update(id, data);
    const updated = await this.findOne(id);
    
    // Emitir webhook si hay cambios relevantes (ej: estado)
    this.emitWebhook(updated, 'reserva.actualizada').catch((err) =>
      console.error('Error enviando webhook update:', err.message),
    );
    
    return updated;
  }
}
