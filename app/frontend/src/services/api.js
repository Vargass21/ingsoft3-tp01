const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
async function request(path, options) {
  try {
    const response = await fetch(`${baseUrl}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || 'La API no pudo procesar la solicitud');
    }
    return response.status === 204 ? null : response.json();
  } catch (error) {
    if (error instanceof TypeError) throw new Error('No se pudo conectar con el backend. Verificá que esté iniciado en el puerto 3000.');
    throw error;
  }
}
export const api = {
  rooms: () => request('/rooms'), createRoom: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  reservations: () => request('/reservations'), createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  status: (id, status) => request(`/reservations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
};
