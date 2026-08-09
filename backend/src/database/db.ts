import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ BANCO CONECTADO COM SUCESSO! 🎉'))
  .catch((err) => console.error('❌ Erro ao conectar:', err.message));