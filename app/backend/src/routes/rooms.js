import { Router } from 'express'; import { listRooms, createRoom, deleteRoom } from '../controllers/roomController.js'; import { asyncHandler } from '../middleware/asyncHandler.js';
export const roomsRouter = Router(); roomsRouter.get('/', asyncHandler(listRooms)); roomsRouter.post('/', asyncHandler(createRoom)); roomsRouter.delete('/:id', asyncHandler(deleteRoom));
