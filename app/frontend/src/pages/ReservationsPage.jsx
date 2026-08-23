import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { StatusActions } from '../components/StatusActions.jsx';

export function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); api.reservations().then(setReservations).catch(reason => setError(reason.message)).finally(() => setLoading(false)); };
  useEffect(load, []);
  const change = async (id, status) => { try { await api.status(id, status); load(); } catch (reason) { setError(reason.message); } };

  return <section><h2>Reservas</h2><p>Consultá las reservas y administrá sus estados.</p>{error && <p role="alert">{error}</p>}{loading ? <p>Cargando reservas...</p> : <table><thead><tr><th>ID</th><th>Sala</th><th>Responsable</th><th>Fecha</th><th>Inicio</th><th>Fin</th><th>Personas</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{reservations.map(reservation => <tr key={reservation.id}><td>{reservation.id}</td><td>{reservation.room_name}</td><td>{reservation.reserved_by}</td><td>{reservation.reservation_date}</td><td>{reservation.start_time}</td><td>{reservation.end_time}</td><td>{reservation.people_count}</td><td>{reservation.status}</td><td><StatusActions status={reservation.status} onChange={status => change(reservation.id, status)} /></td></tr>)}{reservations.length === 0 && <tr><td colSpan="9">Todavía no hay reservas. Creá una desde «Nueva reserva».</td></tr>}</tbody></table>}</section>;
}
