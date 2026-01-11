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

    async createReservation(data) {
  const reservation = this.repo.create({
    user_id: data.user_id,
    resource_id: data.resource_id,
  });
  await this.repo.save(reservation);
}

  async findAll(): Promise<Reservation[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Reservation | null> {
    return this.repo.findOneBy({ id });
  }
}
    