import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const sqlPath = fileURLToPath(new URL('../../migrations/001_init.sql', import.meta.url));
await pool.query(await readFile(sqlPath, 'utf8'));
await pool.end();
console.log('Base de datos inicializada.');
