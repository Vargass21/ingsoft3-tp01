CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  reserved_by VARCHAR(120) NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  people_count INTEGER NOT NULL CHECK (people_count > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_time > start_time)
);

INSERT INTO rooms (name, capacity, active) VALUES
  ('Sala A', 10, TRUE), ('Sala B', 20, TRUE), ('Sala C', 5, TRUE)
ON CONFLICT (name) DO NOTHING;
