import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
const initial = { roomId: '', reservedBy: '', reservationDate: '', startTime: '', endTime: '', peopleCount: '' };

export function NewReservationPage() {
  const [form, setForm] = useState(initial);
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.rooms().then(setRooms).catch(error => setMessage(error.message)).finally(() => setLoading(false)); }, []);
  const change = event => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async event => { event.preventDefault(); if (Object.values(form).some(value => !value)) return setMessage('Completá todos los campos obligatorios'); if (form.endTime <= form.startTime) return setMessage('La hora final debe ser posterior a la inicial'); try { await api.createReservation(form); setForm(initial); setMessage('Reserva creada correctamente'); } catch (error) { setMessage(error.message); } };

  return <section><h2>Nueva reserva</h2><p>Completá los datos para solicitar una sala.</p>{loading ? <p>Cargando salas disponibles...</p> : <form onSubmit={submit}>{message && <p role="alert">{message}</p>}<label>Sala<select aria-label="Sala" name="roomId" value={form.roomId} onChange={change}><option value="">Elegí una sala</option>{rooms.filter(room => room.active).map(room => <option key={room.id} value={room.id}>{room.name} (capacidad {room.capacity})</option>)}</select></label><label>Responsable<input aria-label="Responsable" name="reservedBy" value={form.reservedBy} onChange={change} /></label><label>Fecha<input aria-label="Fecha" name="reservationDate" type="date" value={form.reservationDate} onChange={change} /></label><label>Hora inicio<input aria-label="Hora inicio" name="startTime" type="time" value={form.startTime} onChange={change} /></label><label>Hora final<input aria-label="Hora final" name="endTime" type="time" value={form.endTime} onChange={change} /></label><label>Personas<input aria-label="Personas" name="peopleCount" type="number" min="1" value={form.peopleCount} onChange={change} /></label><button>Crear reserva</button></form>}</section>;
}
