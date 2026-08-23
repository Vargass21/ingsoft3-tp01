const actions = { PENDIENTE: [['CONFIRMADA', 'Confirmar'], ['CANCELADA', 'Cancelar']], CONFIRMADA: [['FINALIZADA', 'Finalizar'], ['CANCELADA', 'Cancelar']] };
export function StatusActions({ status, onChange }) { return <>{(actions[status] || []).map(([next, label]) => <button key={next} onClick={() => onChange(next)}>{label}</button>)}</>; }
