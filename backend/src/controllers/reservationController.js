import { roomRepository } from '../repositories/roomRepository.js';
import { reservationRepository } from '../repositories/reservationRepository.js';
import { createReservationService } from '../services/reservationService.js';
const service = createReservationService({ rooms: roomRepository, reservations: reservationRepository });
export const listReservations = async (_req, res) => res.json(await reservationRepository.list());
export const createReservation = async (req, res) => res.status(201).json(await service.create({
  ...req.body, roomId: Number(req.body.roomId), peopleCount: Number(req.body.peopleCount)
}));
export const changeStatus = async (req, res) => res.json(await service.changeStatus(Number(req.params.id), req.body.status));
