import { Repository } from "typeorm";
import { Reservation } from "./reservation.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ReservationService {
    constructor(
      @InjectRepository(Reservation)
      private readonly repo: Repository<Reservation>
    ) {}

    async createReservation(data): Promise<Reservation> {
  const reservation = this.repo.create({
    user_id: data.user_id,
    resource_name: data.resource_name,
  });
  return await this.repo.save(reservation);
}
}
    