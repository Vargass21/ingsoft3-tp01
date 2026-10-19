import { validateReservationCapacity } from './reservationCapacity.js';

export function validateReservationForm(form) {
  if (Object.values(form).some(value => !value)) {
    return 'Completá todos los campos obligatorios';
  }

  if (form.endTime <= form.startTime) {
    return 'La hora final debe ser posterior a la inicial';
  }

  return null;
}

export async function submitReservation(form, client, rooms) {
  const error = validateReservationForm(form);

  if (error) {
    throw new Error(error);
  }

  if (rooms) {
    const capacityError = validateReservationCapacity(form, rooms);

    if (capacityError) {
      throw new Error(capacityError);
    }
  }

  return client.createReservation(form);
}
