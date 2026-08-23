import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.rooms().then(setRooms).catch(error => setMessage(error.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async event => {
    event.preventDefault();
    setMessage('');
    try { await api.createRoom({ name, capacity: Number(capacity), active: true }); setName(''); setCapacity(''); load(); }
    catch (error) { setMessage(error.message); }
  };

  return <section><h2>Salas</h2><p>Creá y consultá las salas disponibles para reservar.</p>{message && <p role="alert">{message}</p>}<form onSubmit={submit}><input aria-label="Nombre de sala" placeholder="Nombre" value={name} onChange={event => setName(event.target.value)} /><input aria-label="Capacidad" type="number" min="1" placeholder="Capacidad" value={capacity} onChange={event => setCapacity(event.target.value)} /><button>Crear sala</button></form>{loading ? <p>Cargando salas...</p> : <table><thead><tr><th>ID</th><th>Nombre</th><th>Capacidad</th><th>Activa</th></tr></thead><tbody>{rooms.map(room => <tr key={room.id}><td>{room.id}</td><td>{room.name}</td><td>{room.capacity}</td><td>{room.active ? 'Sí' : 'No'}</td></tr>)}{rooms.length === 0 && <tr><td colSpan="4">No hay salas cargadas.</td></tr>}</tbody></table>}</section>;
}
