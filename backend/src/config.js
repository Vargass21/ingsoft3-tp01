import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// El archivo local vive en la raíz para compartir la documentación con Docker.
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export const config = {
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'minireservas',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  }
};
