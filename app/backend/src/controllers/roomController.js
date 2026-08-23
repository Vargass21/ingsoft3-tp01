import { roomRepository } from '../repositories/roomRepository.js';
import { createRoomService } from '../services/roomService.js';
const service = createRoomService(roomRepository);
export const listRooms = async (_req, res) => res.json(await roomRepository.list());
export const createRoom = async (req, res) => res.status(201).json(await service.create({ ...req.body, capacity: Number(req.body.capacity) }));
export const deleteRoom = async (req, res) => { await service.remove(Number(req.params.id)); res.status(204).end(); };
