export function validateReservationCapacity(form, rooms) {
  const selectedRoom = rooms.find(
    room => String(room.id) === form.roomId && room.active,
  );

  if (!selectedRoom) {
    return 'Seleccioná una sala válida antes de crear la reserva';
  }

  if (Number(form.peopleCount) > selectedRoom.capacity) {
    return `La cantidad de personas supera la capacidad de la sala (${selectedRoom.capacity})`;
  }

  return null;
}
